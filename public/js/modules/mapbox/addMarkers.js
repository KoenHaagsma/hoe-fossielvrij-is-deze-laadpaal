import { addBestPole } from './addBestPole.js';

function addMarkers(map, data) {
    const slider = document.querySelector('.slider');
    slider.classList.remove('disabled');
    // Show best pole
    addBestPole(map, data[0]);

    data.map((singleMarker) => {
        console.log(singleMarker);
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
}

export { addMarkers };
