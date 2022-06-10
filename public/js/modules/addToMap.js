mapboxgl.accessToken = 'pk.eyJ1Ijoia29lbmhhYWdzbWEiLCJhIjoiY2w0OGptdnNoMGQ5dDNrcjJhdzB0NG5wMCJ9.l2fZnsgmtiTsrRW_f28CEQ';

function addToMap(map, data) {
    data.map((singleMarker) => {
        const HTMLMarker = document.createElement('div');
        HTMLMarker.className = 'custom-marker';
        HTMLMarker.classList.add(`marker-${singleMarker.score}`);

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

export { addToMap };
