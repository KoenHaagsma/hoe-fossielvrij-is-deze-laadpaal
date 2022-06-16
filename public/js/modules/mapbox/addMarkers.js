import { addBestPole } from './addBestPole.js';
import { renderElementAndClean, renderElement, cleanElement } from '../renderElement.js';

function addMarkers(map, data) {
    const slider = document.querySelector('.slider');
    slider.classList.remove('disabled');
    // Show best pole
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

        const allMarkers = document.querySelectorAll('.custom-marker');
        const allMarkersArray = [...allMarkers];
        const maxPolesList = 11;
        let bestPoles = [];

        if (allMarkersArray.length < maxPolesList) {
            bestPoles = allMarkersArray;
        } else {
            bestPoles = allMarkersArray.slice(1, maxPolesList);
        }

        const listContainer = document.querySelector('.list-container');
        listContainer.classList.remove('disabled');
        const slider = document.querySelector('#time');

        const HTML = `
        <ol>
            ${bestPoles
                .map(
                    (bestPole, index) =>
                        `<li class='${index} marker-${bestPole.markerTimeFrame[slider.value]}'>
                            <section><p>${index + 1}.</p><p>Laadpaal - ${bestPole.provider}</p></section>
                            <section><p>Nu: <div class="power-${
                                bestPole.markerTimeFrame[slider.value]
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
    });
}

export { addMarkers };
