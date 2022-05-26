const express = require('express');
const app = express();
const Xray = require('x-ray');
require('dotenv').config();
const { InfluxDB } = require('@influxdata/influxdb-client');

const port = process.env.PORT || 4242;

// Get all plug-in cars
app.get('/ev', async (req, res) => {
    var x = Xray();
    const data = await x('https://ev-database.nl/', '.list-item', [
        {
            make: 'h2 span',
            model: '.model',
            efficiency: '.efficiency',
            topspeed: '.topspeed',
        },
    ]);
    res.json(data);
});

app.get('/em', async (req, res) => {
    const INFLUXDB_URL = process.env.INFLUXDB_URL;
    const INFLUXDB_ORG = process.env.INFLUXDB_ORG;
    const INFLUXDB_KEY = process.env.INFLUXDB_KEY;

    const client = new InfluxDB({ url: INFLUXDB_URL, token: INFLUXDB_KEY });
    const queryApi = client.getQueryApi(INFLUXDB_ORG);

    const groupBy = (items, prop) => {
        return items.reduce((out, item) => {
            const value = item[prop];
            out[value] = out[value] || [];
            out[value].push(item);
            return out;
        }, {});
    };

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
        res.json([]);
    }
});

app.listen(port, () => console.log(`server started on port http://localhost:${port}`));
