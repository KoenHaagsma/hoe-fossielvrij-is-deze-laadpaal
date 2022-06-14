import { setupMap } from './modules/mapbox/setupMap.js';
import { timeSlider } from './modules/timeSlider.js';
import { renderElementAndClean, renderElement, cleanElement } from './modules/renderElement.js';

const loadedMarkers = [];

if (window.location.pathname === '/map') {
    const mapContainer = document.querySelector('#map');

    cleanElement(mapContainer);

    // Center on Amsterdam first load
    let location = { lat: 52.370216, lng: 4.895168 };
    setupMap(location);
}
