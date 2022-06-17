import { CONFIG } from './config/flashMessageConfig.js';

function timeSlider(map) {
    const slider = document.querySelector('#time');
    const time = document.querySelector('.timeP');
    const timeNow = new Date().getHours();

    let timeFuture = parseInt(timeNow) + parseInt(slider.value);
    if (timeFuture > 24) {
        timeFuture -= 25;
    }
    time.innerText = `${timeFuture}:00`;

    try {
        let markers = document.querySelectorAll('.custom-marker');
        const sources = map.getStyle().sources;
        // https://stackoverflow.com/a/53443378
        const filteredSources = (({ composite, ...o }) => o)(sources);
        let bestPoles = document.querySelectorAll('.custom-marker-best-pole');
        const bestPolesArray = [];

        bestPoles.forEach((pole) => {
            pole.classList.replace(pole.classList[1], pole.markerTimeFrame[slider.value]);
        });

        const filteredArray = Object.entries(filteredSources);

        filteredArray.forEach((source) => {
            let markersInPolygon = [];
            let bestMarkerScore = 720;
            let bestPole;

            const polygonValues = source[1].data.geometry.coordinates;
            const polygon = turf.polygon([polygonValues[0]]);
            const markersArray = [...markers];

            markersArray.forEach((marker) => {
                const point = turf.point([marker.coordinates[0], marker.coordinates[1]]);
                const ifIsInPolygon = turf.booleanPointInPolygon(point, polygon);
                if (!ifIsInPolygon) return;
                markersInPolygon.push(marker);
            });

            markersInPolygon.forEach((marker) => {
                if (marker.markerTimeScore[slider.value] < bestMarkerScore) {
                    bestMarkerScore = marker.markerTimeScore[slider.value];
                    bestPole = marker;
                }
                marker.classList.replace(marker.classList[1], `marker-${marker.markerTimeFrame[slider.value]}`);
            });
            bestPolesArray.push(bestPole);
        });

        bestPolesArray.forEach((bestPole) => {
            bestPole.classList.replace(bestPole.classList[1], 'custom-marker-best-pole');
        });
    } catch (error) {
        console.error(error);
        window.FlashMessage.error(error, CONFIG);
        return;
    }
}

export { timeSlider };
