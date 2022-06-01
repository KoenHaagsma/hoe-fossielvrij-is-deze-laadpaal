const express = require('express');
const app = express();
const Xray = require('x-ray');
require('dotenv').config();
const { InfluxDB } = require('@influxdata/influxdb-client');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const { groupBy } = require('./helpers/groupBy.js');
const { formatLngLat } = require('./helpers/formatLngLat.js');

app.use(cors());

const port = process.env.PORT || 4242;

const INFLUXDB_URL = process.env.INFLUXDB_URL;
const INFLUXDB_ORG = process.env.INFLUXDB_ORG;
const INFLUXDB_KEY = process.env.INFLUXDB_KEY;

// Get all plug-in cars
app.get('/ev', async (req, res) => {
    const x = Xray();

    try {
        const data = await x('https://ev-database.nl/', '.list-item', [
            {
                make: 'h2 span',
                model: '.model',
                efficiency: '.efficiency',
                topspeed: '.topspeed',
            },
        ]);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.json({ error });
    }
});

// Electricity map
app.get('/em', async (req, res) => {
    const client = new InfluxDB({ url: INFLUXDB_URL, token: INFLUXDB_KEY });
    const queryApi = client.getQueryApi(INFLUXDB_ORG);

    const query = `
    from(bucket: "elmap")
    |> range(start: now(), stop: 25h)
    |> filter(fn: (r) => r["_measurement"] == "forecast")
    |> filter(fn: (r) => r["kind"] == "powerConsumptionBreakdown")
    |> filter(fn: (r) => r["zone"] == "NL")
    |> filter(fn: (r) => r["timeoffset"] == "baseline")
    |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
    |> sort(columns: ["_time"], desc: false)
    |> yield(name: "mean")
    `;

    try {
        const rows = await queryApi.collectRows(query);
        const data = Object.entries(groupBy(rows, '_field'));
        res.json(data);
    } catch (error) {
        console.error(error);
        res.json({ error });
    }
});

// Energy providers
app.get('/ep', async (req, res) => {
    const client = new InfluxDB({ url: INFLUXDB_URL, token: INFLUXDB_KEY });
    const queryApi = client.getQueryApi(INFLUXDB_ORG);

    const query = `
    from(bucket: "providers")
    |> range(start: -28h, stop: -24h)
    |> filter(fn: (r) => r["_measurement"] == "past_providers")
    `;

    try {
        const rows = await queryApi.collectRows(query);
        const data = Object.entries(groupBy(rows, '_field'));
        res.json(data);
    } catch (error) {
        console.error(error);
        res.json({ error });
    }
});

app.get('/sr', async (req, res) => {
    const decimalPoints = 16;
    const plusMinus = 0.03;
    const zoomValue = 15;

    const lngF = formatLngLat(req.query.lng, decimalPoints, plusMinus, true);
    const lngS = formatLngLat(req.query.lng, decimalPoints, plusMinus, false);
    const latF = formatLngLat(req.query.lat, decimalPoints, plusMinus, true);
    const latS = formatLngLat(req.query.lat, decimalPoints, plusMinus, false);

    console.log(lngF, lngS, latF, latS);

    try {
        // Lesser values first!
        const url = `https://ui-map.shellrecharge.com/api/map/v2/markers/${lngS}/${lngF}/${latS}/${latF}/${zoomValue}`;
        // Example URL
        // const url = `https://ui-map.shellrecharge.com/api/map/v2/markers/${4.8130318780517545}/${4.8679635186767545}/${52.37003725903988}/${52.39298456934279}/${zoomValue}`;
        console.log(url);
        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error(error);
        res.json({ error });
    }
});

app.listen(port, () => console.log(`server started on port http://localhost:${port}`));