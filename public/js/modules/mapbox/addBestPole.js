function addBestPole(map, bestPole) {
    const HTMLMarker = document.createElement('div');
    HTMLMarker.className = 'custom-marker';
    HTMLMarker.classList.add(`custom-marker-best-pole`);
    HTMLMarker['markerTimeFrame'] = bestPole.timeFrame;
    HTMLMarker['markerTimeScore'] = bestPole.timeFrameScore;
    HTMLMarker['coordinates'] = [bestPole.coordinates.longitude, bestPole.coordinates.latitude];
    HTMLMarker['provider'] = bestPole.operatorName;
    HTMLMarker['status'] = bestPole.status;

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`<section>
        <p>${Math.round(bestPole.distance * 1000)}m</p>
        <p>${bestPole.status}</p>
        <div><p>Laadpaal</p><p>${bestPole.operatorName}</p></div>
        <div><p>Nu:</p><div class="pop-up-img power-${bestPole.score}"></div></div>
        <a target="_blank" href="http://www.google.com/maps/place/${bestPole.coordinates.latitude},${
        bestPole.coordinates.longitude
    }">Navigeer naar paal</a>
        </section>`);

    const bestMarker = new mapboxgl.Marker(HTMLMarker, {
        scale: 0.5,
    })
        .setLngLat([bestPole.coordinates.longitude, bestPole.coordinates.latitude])
        .setPopup(popup)
        .addTo(map);
}

export { addBestPole };
