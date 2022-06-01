mapboxgl.accessToken = 'pk.eyJ1Ijoia29lbmhhYWdzbWEiLCJhIjoiY2wzbjNuY255MGF3ODNwbnl2amJuYms4MCJ9.QD5jhV_KLgBjGYcGOFnwTg';

setMap();

function setMap() {
    const setPosition = (position) => {
        setupMap({ lat: position.coords.latitude, lng: position.coords.longitude });
    };

    const errorLocation = (position) => {
        setupMap({ lat: -1, lng: -2 });
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition, errorLocation, {
            enableHighAccuracy: true,
        });
    } else {
        return false;
    }
}

function setupMap(position) {
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [position.lng, position.lat],
        zoom: 15,
    });

    map.on('load', async () => {
        try {
            const response = await fetch(`/poles?lng=${position.lng}&lat=${position.lat}`);
            const data = await response.json();

            data.map((singleMarker) => {
                let marker = new mapboxgl.Marker({
                    scale: 0.5,
                })
                    .setLngLat([singleMarker.coordinates.longitude, singleMarker.coordinates.latitude])
                    .addTo(map);
            });
        } catch (e) {
            console.error(e);
        }

        map.addControl(
            new mapboxgl.GeolocateControl({
                positionoptions: {
                    enableHighAccuracy: true,
                },
                // When active the map will receive updates to the device's location as it changes.
                trackUserLocation: true,
                // Draw an arrow next to the location dot to indicate which direction the device is heading.
                showUserHeading: true,
            }),
            'bottom-right',
        );
    });
}
