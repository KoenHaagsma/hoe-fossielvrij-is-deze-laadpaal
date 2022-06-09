import { setupMap } from './modules/setupMap.js';
import { renderElementAndClean, renderElement, cleanElement } from './modules/renderElement.js';

if (window.location.pathname === '/map') {
    const buttons = document.querySelector('.buttons');
    const mapContainer = document.querySelector('#map');

    const setPosition = (position) => {
        cleanElement(mapContainer);
        let location = { lat: position.coords.latitude, lng: position.coords.longitude };
        setupMap(location);
    };

    const errorLocation = (error) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.error('User denied the request for Geolocation.');
                break;

            case error.POSITION_UNAVAILABLE:
                console.error('Location information is unavailable.');
                break;

            case error.TIMEOUT:
                console.error('The request to get user location timed out.');
                break;

            case error.UNKNOWN_ERROR:
                console.error('An unknown error occurred.');
                break;
        }
    };

    navigator.geolocation.getCurrentPosition(setPosition, errorLocation, {
        enableHighAccuracy: true,
    });
}
