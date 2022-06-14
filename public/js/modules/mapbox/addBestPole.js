function addBestPole(map, bestPole) {
    const HTMLMarker = document.createElement('div');
    HTMLMarker.className = 'custom-marker';
    HTMLMarker.classList.add(`custom-marker-best-pole`);
    HTMLMarker['markerTimeFrame'] = bestPole.timeFrame;
    HTMLMarker['markerTimeScore'] = bestPole.timeFrameScore;
    HTMLMarker['coordinates'] = [bestPole.coordinates.longitude, bestPole.coordinates.latitude];

    const bestMarker = new mapboxgl.Marker(HTMLMarker, {
        scale: 0.5,
    })
        .setLngLat([bestPole.coordinates.longitude, bestPole.coordinates.latitude])
        .addTo(map);
}

export { addBestPole };
