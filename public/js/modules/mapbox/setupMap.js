import { addMarkers } from './addMarkers.js';
import { addUserLocation } from './addUserLocation.js';
import { drawRegion } from './drawRegion.js';
import { timeSlider } from '../timeSlider.js';
import { poleList } from '../poleList.js';
import { Loading } from '../loading.js';
import { CONFIG } from '../config/flashMessageConfig.js';

mapboxgl.accessToken = 'pk.eyJ1Ijoia29lbmhhYWdzbWEiLCJhIjoiY2w0OGptdnNoMGQ5dDNrcjJhdzB0NG5wMCJ9.l2fZnsgmtiTsrRW_f28CEQ';

const userLocationButton = document.querySelector('.getUserLocation');
const bottomMenu = document.querySelector('.buttomMenu');
const zoom = 8;
const maxMarkerValue = 10;
const maxMarkers = maxMarkerValue;

function setupMap(position) {
    // Add map to map container
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [position.lng, position.lat],
        zoom: zoom,
    });

    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        placeholder: 'Zoek naar een plaats',
        mapboxgl: mapboxgl,
        bbox: [3.31497114423, 50.803721015, 7.09205325687, 53.5104033474],
        proximity: {
            longitude: 3.31497114423,
            latitude: 53.5104033474,
        },
        marker: false,
        flyTo: {
            zoom: zoom * 1.45,
        },
    });

    // Geocoder on search and found a location then ->
    geocoder.on('result', async (event) => {
        // Add geocoder to map (Location finder)
        const loadedMap = document.querySelector('#map');
        Loading.start(loadedMap);
        try {
            let coordinates = {};
            const plusMinus = 0.01;

            if (event.result.bbox === undefined || event.result.bbox === null || !event.result.bbox) {
                coordinates = {
                    lngF: event.result.center[0] - plusMinus,
                    lngS: event.result.center[0] + plusMinus,
                    latF: event.result.center[1] - plusMinus,
                    latS: event.result.center[1] + plusMinus,
                };
            } else {
                coordinates = {
                    lngF: event.result.bbox[0],
                    lngS: event.result.bbox[2],
                    latF: event.result.bbox[1],
                    latS: event.result.bbox[3],
                };
            }
            const response = await fetch(
                `/poles?lngF=${coordinates.lngF}&latF=${coordinates.latF}&lngS=${coordinates.lngS}&latS=${coordinates.latS}`,
            );
            const data = await response.json();

            drawRegion(map, coordinates, event.result.id);

            // TODO: Add state for no poles found
            if (!data || data === undefined || data.length === 0) return;

            // Add all other markers
            addMarkers(map, data.slice(0, maxMarkers));
            Loading.remove();
        } catch (error) {
            // Catch error if area was already searched for and return afterwards
            console.error(error);
            window.FlashMessage.error('The location you searched for is already loaded on the map');
            Loading.remove();
            return;
        }
    });

    map.on('load', async () => {
        try {
            if (window.localStorage.getItem('user-location')) {
                window.addEventListener('load', async () => {
                    window.FlashMessage.info('Navigeren naar laatste eigen locatie', CONFIG);
                    const center = JSON.parse(window.localStorage.getItem('user-location'));
                    map.flyTo({
                        center: center.center,
                        essential: true,
                        zoom: zoom * 1.45,
                    });

                    addUserLocation(map, center.center);

                    let coordinates = {
                        lngF: center.center[0] - 0.01,
                        lngS: center.center[0] + 0.01,
                        latF: center.center[1] - 0.01,
                        latS: center.center[1] + 0.01,
                    };

                    let id = coordinates.lngF + coordinates.latF;

                    drawRegion(map, coordinates, id);

                    const response = await fetch(
                        `/poles?lngF=${coordinates.lngF}&latF=${coordinates.latF}&lngS=${coordinates.lngS}&latS=${coordinates.latS}`,
                    );
                    const data = await response.json();

                    addMarkers(map, data.slice(0, maxMarkers));
                });
            }

            const bigListButton = document.querySelector('.openMenu');
            const slider = document.querySelector('.slider');
            const sliderValue = document.querySelector('#time');
            const plus = document.querySelector('.plus');
            const minus = document.querySelector('.minus');
            const bestTime = document.querySelector('.content > span');
            let clicked = 1;

            userLocationButton.style.display = 'flex';
            bottomMenu.style.display = 'flex';

            map.addControl(geocoder);

            slider.addEventListener('input', (event) => {
                event.preventDefault();
                timeSlider(map);
            });

            plus.addEventListener('click', (e) => {
                e.preventDefault();
                sliderValue.value++;
                timeSlider(map);
            });

            minus.addEventListener('click', (e) => {
                e.preventDefault();
                sliderValue.value--;
                timeSlider(map);
            });

            bigListButton.addEventListener('click', (event) => {
                event.preventDefault();
                const allMarkers = document.querySelectorAll('.custom-marker');
                if (allMarkers.length === 0) {
                    window.FlashMessage.warning('Voeg eerst laadpalen toe voordat je de lijst kan bekijken', CONFIG);
                    return;
                }
                clicked++;
                poleList(map, clicked, zoom, allMarkers);
            });

            userLocationButton.addEventListener('click', (event) => {
                event.preventDefault();
                const loadedMap = document.querySelector('#map');
                Loading.start(loadedMap);

                const setPosition = async (position) => {
                    let center;

                    if (!window.localStorage.getItem('user-location')) {
                        center = { center: [position.coords.longitude, position.coords.latitude] };
                        window.localStorage.setItem('user-location', JSON.stringify(center));
                    } else {
                        center = position;
                    }

                    map.flyTo({
                        center: center.center,
                        essential: true,
                        zoom: zoom * 1.45,
                    });

                    addUserLocation(map, center.center);

                    let coordinates = {
                        lngF: center.center[0] - 0.01,
                        lngS: center.center[0] + 0.01,
                        latF: center.center[1] - 0.01,
                        latS: center.center[1] + 0.01,
                    };

                    let id = coordinates.lngF + coordinates.latF;

                    drawRegion(map, coordinates, id);

                    const response = await fetch(
                        `/poles?lngF=${coordinates.lngF}&latF=${coordinates.latF}&lngS=${coordinates.lngS}&latS=${coordinates.latS}`,
                    );
                    const data = await response.json();

                    addMarkers(map, data.slice(0, maxMarkers));
                    Loading.remove();
                };

                const errorLocation = (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            window.FlashMessage.error('You denied the request for Geolocation.');
                            Loading.remove();
                            break;

                        case error.POSITION_UNAVAILABLE:
                            window.FlashMessage.error('Location information is unavailable.');
                            Loading.remove();
                            break;

                        case error.TIMEOUT:
                            window.FlashMessage.error('The request to get user location timed out.');
                            Loading.remove();
                            break;

                        case error.UNKNOWN_ERROR:
                            window.FlashMessage.error('An unknown error occurred.');
                            Loading.remove();
                            break;
                    }
                };

                if (window.localStorage.getItem('user-location')) {
                    setPosition(JSON.parse(window.localStorage.getItem('user-location')));
                } else {
                    navigator.geolocation.getCurrentPosition(setPosition, errorLocation, {
                        enableHighAccuracy: true,
                    });
                }
            });
        } catch (e) {
            Loading.remove();
            console.error(e);
        }
    });
}

export { setupMap };
