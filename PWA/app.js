const express = require('express');
require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const compression = require('compression');

const { groupBy } = require('./helpers/groupBy.js');
const { formatLngLat } = require('./helpers/formatLngLat.js');

const app = express();

app.use(compression());

app.use(/.*-[0-9a-f]{10}\..*/, (req, res, next) => {
    res.setHeader('Cache-Control', 'max-age=365000000, immutable');
    next();
});

// Template engine
app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
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

app.use((req, res) => {
    res.status(404).render('error404');
});

app.listen(process.env.PORT, () => {
    console.log(`Application started on port: http://localhost:${process.env.PORT}`);
});
