const { InfluxDB } = require('@influxdata/influxdb-client');
require('dotenv').config();
const cors = require('cors');

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

app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

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

app.get('/map', async (req, res) => {
    res.render('map');
});

app.get('/list', (req, res) => {
    res.render('list');
});

app.get('/poles', async (req, res) => {
    const zoomValue = 100;
    const lngF = parseFloat(req.query.lngF);
    const lngS = parseFloat(req.query.lngS);
    const latF = parseFloat(req.query.latF);
    const latS = parseFloat(req.query.latS);

    try {
        const client = new InfluxDB({ url: process.env.INFLUXDB_URL, token: process.env.INFLUXDB_KEY });
        const queryApi = client.getQueryApi(process.env.INFLUXDB_ORG);

        const query = `
        from(bucket: "providers")
            |> range(start: -49h, stop: -24h)
            |> filter(fn: (r) => r["_measurement"] == "past_providers")
        `;
        const urlShell = `https://ui-map.shellrecharge.com/api/map/v2/markers/${lngF}/${lngS}/${latF}/${latS}/${zoomValue}`;

        const response = await fetch(urlShell, {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            type: 'GET',
            mode: 'cors',
        });
        const dataShell = await response.json();
        const rows = await queryApi.collectRows(query);
        const dataProviders = Object.entries(groupBy(rows, '_field'));

        // Calculate average CO2/kwh per provider
        let providersUsage = {};
        for (provider in dataProviders) {
            const futureDataScore = [];
            const futureData = [];

            for (prov in dataProviders[provider][1]) {
                futureDataScore.push(poleScore(dataProviders[provider][1][prov]._value));
                futureData.push(dataProviders[provider][1][prov]._value);
            }

            providersUsage[dataProviders[provider][0]] = dataProviders[provider][1][0]._value;
            providersUsage[`${dataProviders[provider][0]}-timeFrame`] = futureDataScore;
            providersUsage[`${dataProviders[provider][0]}-timeScore`] = futureData;
        }

        // Add provider usage to single pole (object) and pole score with that + distance to person
        let biggestValue = 0;
        dataShell.map((pole) => {
            // Lat -> Lng
            const from = turf.point([parseFloat(latF).toFixed(16), parseFloat(lngF).toFixed(16)]);
            const to = turf.point([pole.coordinates.latitude, pole.coordinates.longitude]);

            pole.operatorName = changeOperator(pole.operatorName);
            pole['emissions'] = providersUsage[pole.operatorName];
            // For dynamic emissions
            if (pole['emissions'] >= biggestValue) {
                biggestValue = pole['emissions'];
            }
            pole['score'] = poleScore(pole['emissions'], biggestValue);
            // Defaults to kilometres
            pole['distance'] = turf.distance(from, to);
            pole['timeFrame'] = providersUsage[`${pole.operatorName}-timeFrame`];
            pole['timeFrameScore'] = providersUsage[`${pole.operatorName}-timeScore`];
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
