const { InfluxDB } = require('@influxdata/influxdb-client');

const express = require('express');
const app = express();
require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const compression = require('compression');
const path = require('path');

const { groupBy } = require('./helpers/groupBy.js');
const { formatLngLat } = require('./helpers/formatLngLat.js');

app.use(compression());

app.use(/.*-[0-9a-f]{10}\..*/, (req, res, next) => {
    res.setHeader('Cache-Control', 'max-age=365000000, immutable');
    next();
});

// Template engine
app.set('view engine', 'pug');
app.set('views', './views');

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/offline', (req, res) => {
    res.render('offline');
});

app.get('/map', (req, res) => {
    res.render('map');
});

app.get('/list', (req, res) => {
    res.render('list');
});

app.get('/poles', async (req, res) => {
    const decimalPoints = 16;
    const plusMinus = 0.03;
    const zoomValue = 15;

    const lngF = formatLngLat(req.query.lng, decimalPoints, plusMinus, true);
    const lngS = formatLngLat(req.query.lng, decimalPoints, plusMinus, false);
    const latF = formatLngLat(req.query.lat, decimalPoints, plusMinus, true);
    const latS = formatLngLat(req.query.lat, decimalPoints, plusMinus, false);

    try {
        const client = new InfluxDB({ url: process.env.INFLUXDB_URL, token: process.env.INFLUXDB_KEY });
        const queryApi = client.getQueryApi(process.env.INFLUXDB_ORG);
        // Lesser values first!
        const urlShell = `https://ui-map.shellrecharge.com/api/map/v2/markers/${lngS}/${lngF}/${latS}/${latF}/${zoomValue}`;
        const response = await fetch(urlShell);
        const dataShell = await response.json();

        const query = `
        from(bucket: "providers")
            |> range(start: -28h, stop: -24h)
            |> filter(fn: (r) => r["_measurement"] == "past_providers")
        `;

        const rows = await queryApi.collectRows(query);
        const dataProviders = Object.entries(groupBy(rows, '_field'));

        console.log(dataProviders[0][0]);
        console.log(dataShell[0]);
        res.json(dataShell);
    } catch (error) {
        console.error(error);
        res.json({ error });
    }
});

app.use((req, res) => {
    res.status(404).render('error404');
});

app.listen(process.env.PORT, () => {
    console.log(`Application started on port: http://localhost:${process.env.PORT}`);
});
