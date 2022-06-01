mapboxgl.accessToken = 'pk.eyJ1Ijoia29lbmhhYWdzbWEiLCJhIjoiY2wzbjNuY255MGF3ODNwbnl2amJuYms4MCJ9.QD5jhV_KLgBjGYcGOFnwTg';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('../sw.js').then(function (registration) {
            return registration.update();
        });
    });
}

// Setup map
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
                const marker = new mapboxgl.Marker({
                    scale: 0.5,
                })
                    .setLngLat([singleMarker.coordinates.longitude, singleMarker.coordinates.latitude])
                    .addTo(map);

                marker._element.addEventListener('click', (event) => {
                    event.preventDefault();
                    const detailContainer = document.querySelector('.details');

                    console.log(detailContainer.classList.contains('open'));

                    if (detailContainer.classList.contains('open')) {
                        detailContainer.classList.remove('open');
                    } else {
                        detailContainer.classList.add('open');
                    }

                    console.log(detailContainer);
                    console.log(`click - ${singleMarker.operatorName} - ${singleMarker.uniqueKey}`);
                });
            });
        } catch (e) {
            console.error(e);
        }

        map.addControl(
            new mapboxgl.GeolocateControl({
                positionoptions: {
                    enableHighAccuracy: true,
                },
                trackUserLocation: true,
                showUserHeading: true,
            }),
            'top-right',
        );
    });
}
