function addUserLocation(map, location) {
    const HTMLMarkerPersonal = document.createElement('div');
    HTMLMarkerPersonal.className = 'custom-marker-personal';
    const personalMarker = new mapboxgl.Marker(HTMLMarkerPersonal, {
        scale: 0.5,
    })
        .setLngLat([location[0], location[1]])
        .addTo(map);
}

export { addUserLocation };
