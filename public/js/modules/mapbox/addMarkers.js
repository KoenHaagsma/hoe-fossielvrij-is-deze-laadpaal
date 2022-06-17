import { addBestPole } from './addBestPole.js';
import { renderElementAndClean, renderElement, cleanElement } from '../renderElement.js';

let clicked = 1;

function addMarkers(map, data) {
    const slider = document.querySelector('.slider');
    slider.classList.remove('disabled');

    addBestPole(map, data[0]);

    data.map((singleMarker, index) => {
        if (index === 0) return;
        const HTMLMarker = document.createElement('div');
        HTMLMarker.className = 'custom-marker';
        HTMLMarker.classList.add(`marker-${singleMarker.score}`);
        HTMLMarker['markerTimeFrame'] = singleMarker.timeFrame;
        HTMLMarker['markerTimeScore'] = singleMarker.timeFrameScore;
        HTMLMarker['coordinates'] = [singleMarker.coordinates.longitude, singleMarker.coordinates.latitude];
        HTMLMarker['provider'] = singleMarker.operatorName;
        HTMLMarker['status'] = singleMarker.status;

        // Pop up for testing energy providers
        const popup = new mapboxgl.Popup({ offset: 25 }).setText(`${singleMarker.operatorName}`);

        const marker = new mapboxgl.Marker(HTMLMarker, {
            scale: 0.4,
        })
            .setLngLat([singleMarker.coordinates.longitude, singleMarker.coordinates.latitude])
            .setPopup(popup)
            .addTo(map);

        marker._element.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('click marker');
        });
    });

    const sources = map.getStyle().sources;
    // https://stackoverflow.com/a/53443378
    const filteredSources = (({ composite, ...o }) => o)(sources);
    console.log(filteredSources);
    if (Object.entries(filteredSources).length === 1 || Object.entries(filteredSources).length === 0) {
        const allMarkers = document.querySelectorAll('.custom-marker');
        const allMarkersArray = [...allMarkers];
        let bestPoles = [];
        const regionValue = parseInt(document.querySelector('#region').value);
        const regionContainer = document.querySelector('.region');

        bestPoles = allMarkersArray.slice(
            regionValue === 1 ? regionValue - 1 : (regionValue - 1) * 10,
            allMarkersArray.length,
        );

        const listContainer = document.querySelector('.list-container');
        listContainer.classList.remove('disabled');
        const sliderValue = document.querySelector('#time').value;

        const HTML = `
        <ol>
            ${bestPoles
                .map(
                    (bestPole, index) =>
                        `<li class='${index} marker-${bestPole.markerTimeFrame[sliderValue]}'>
                            <section><p>${index + 1}.</p><p>Laadpaal - ${bestPole.provider}</p></section>
                            <section><p>Nu: <div class="power-${
                                bestPole.markerTimeFrame[sliderValue]
                            }"></div></p></section>
                            <section><a target="_blank" href="http://www.google.com/maps/place/${
                                bestPole.coordinates[1]
                            },${bestPole.coordinates[0]}">Navigeer naar paal</a></section>
                        </li>`,
                )
                .join('\n ')}
        </ol>
        `;

        regionContainer.classList.remove('disabled');
        renderElementAndClean(listContainer, HTML, 'afterbegin');
    } else {
        const counter = document.querySelector('.region > input');
        const regionsMarkers = [];
        const polesMarkers = [];

        Object.entries(filteredSources).forEach(([key, val]) => {
            const points = turf.points(val.data.geometry.coordinates[0]);
            const formedObject = {
                area: val.data.geometry.coordinates[0],
                center: turf.center(points).geometry.coordinates,
            };
            regionsMarkers.push(formedObject);
        });

        const allMarkers = document.querySelectorAll('.custom-marker');
        const allMarkersArray = [...allMarkers];

        regionsMarkers.forEach((region) => {
            const markersInRegion = [];
            const points = region.area;
            const polygon = turf.polygon([points]);

            allMarkersArray.forEach((marker) => {
                const point = turf.point(marker.coordinates);
                const ifIsInPolygon = turf.booleanPointInPolygon(point, polygon);
                if (!ifIsInPolygon) return;
                markersInRegion.push(marker);
            });
            polesMarkers.push(markersInRegion);
        });

        counter.value = polesMarkers.length;
        counter.max = polesMarkers.length;
        const listContainer = document.querySelector('.list-container');
        const sliderValue = document.querySelector('#time').value;
        const HTML = `
        <ol>
            ${polesMarkers[counter.value - 1]
                .map(
                    (bestPole, index) =>
                        `<li class='${index} marker-${bestPole.markerTimeFrame[sliderValue]}'>
                            <section><p>${index + 1}.</p><p>Laadpaal - ${bestPole.provider}</p></section>
                            <section><p>Nu: <div class="power-${
                                bestPole.markerTimeFrame[sliderValue]
                            }"></div></p></section>
                            <section><a target="_blank" href="http://www.google.com/maps/place/${
                                bestPole.coordinates[1]
                            },${bestPole.coordinates[0]}">Navigeer naar paal</a></section>
                        </li>`,
                )
                .join('\n ')}
        </ol>
        `;

        renderElementAndClean(listContainer, HTML, 'afterbegin');
    }
}

export { addMarkers };
