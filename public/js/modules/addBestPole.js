function addBestPole(map, bestPole) {
    const HTMLMarkerBest = document.createElement('div');
    HTMLMarkerBest.className = 'custom-marker-best-pole';

    const bestMarker = new mapboxgl.Marker(HTMLMarkerBest, {
        scale: 0.5,
    })
        .setLngLat([bestPole.coordinates.longitude, bestPole.coordinates.latitude])
        .addTo(map);
}

export { addBestPole };
