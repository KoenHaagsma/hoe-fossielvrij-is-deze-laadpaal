import { setupMap } from './modules/setupMap.js';
import { renderElementAndClean, renderElement, cleanElement } from './modules/renderElement.js';

if (window.location.pathname === '/map') {
    const mapContainer = document.querySelector('#map');

    cleanElement(mapContainer);

    // Center on Amsterdam first load
    let location = { lat: 52.370216, lng: 4.895168 };
    setupMap(location);

    // const setPosition = (position) => {
    //     cleanElement(mapContainer);
    //     console.log(position);
    // };

    // const errorLocation = (error) => {
    //     switch (error.code) {
    //         case error.PERMISSION_DENIED:
    //             console.error('User denied the request for Geolocation.');
    //             break;

    //         case error.POSITION_UNAVAILABLE:
    //             console.error('Location information is unavailable.');
    //             break;

    //         case error.TIMEOUT:
    //             console.error('The request to get user location timed out.');
    //             break;

    //         case error.UNKNOWN_ERROR:
    //             console.error('An unknown error occurred.');
    //             break;
    //     }
    // };

    // navigator.geolocation.getCurrentPosition(setPosition, errorLocation, {
    //     enableHighAccuracy: true,
    // });
}
