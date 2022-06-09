const { InfluxDB } = require('@influxdata/influxdb-client');
require('dotenv').config();

const express = require('express');
const app = express();

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const compression = require('compression');
const path = require('path');
const turf = require('@turf/turf');

const { groupBy } = require('./helpers/groupBy.js');
const { formatLngLat } = require('./helpers/formatLngLat.js');
const { changeOperator } = require('./helpers/changeOperator.js');
const { poleScore } = require('./helpers/poleScore.js');

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

        const query = `
        from(bucket: "providers")
            |> range(start: -28h, stop: -24h)
            |> filter(fn: (r) => r["_measurement"] == "past_providers")
        `;
        const urlShell = `https://ui-map.shellrecharge.com/api/map/v2/markers/${lngS}/${lngF}/${latS}/${latF}/${zoomValue}`;

        const response = await fetch(urlShell);
        const dataShell = await response.json();

        const rows = await queryApi.collectRows(query);
        const dataProviders = Object.entries(groupBy(rows, '_field'));

        // Calculate average CO2/kwh per provider
        let providersUsage = {};
        for (provider in dataProviders) {
            let count = 0;
            let providerUsage = 0;

            dataProviders[provider][1].forEach((timeRange) => {
                providerUsage += timeRange._value;
                count++;
            });

            providersUsage[dataProviders[provider][0]] = providerUsage / count;
        }

        console.log(providersUsage);
        for (let index = 0; index < 20; index++) {
            console.log(dataShell[index]);
        }

        // Add provider usage to single pole (object) and pole score with that + distance to person
        dataShell.map((pole) => {
            // Lat -> Lng
            const from = turf.point([parseFloat(req.query.lat).toFixed(16), parseFloat(req.query.lng).toFixed(16)]);
            const to = turf.point([pole.coordinates.latitude, pole.coordinates.longitude]);

            pole.operatorName = changeOperator(pole.operatorName);
            pole['emissions'] = providersUsage[pole.operatorName];
            pole['score'] = poleScore(pole['emissions']);
            // Defaults to kilometres
            pole['distance'] = turf.distance(from, to);
        });

        // Sort based on emissions and then on distance
        dataShell.sort((a, b) => {
            if (a.emissions === b.emissions) {
                return a.distance < b.distance ? -1 : 1;
            } else {
                return a.emissions < b.emissions ? -1 : 1;
            }
        });

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
