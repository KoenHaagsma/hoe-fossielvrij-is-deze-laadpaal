import { addMarkers } from './addMarkers.js';
import { addBestPole } from './addBestPole.js';
import { addUserLocation } from './addUserLocation.js';
import { drawRegion } from './drawRegion.js';

mapboxgl.accessToken = 'pk.eyJ1Ijoia29lbmhhYWdzbWEiLCJhIjoiY2w0OGptdnNoMGQ5dDNrcjJhdzB0NG5wMCJ9.l2fZnsgmtiTsrRW_f28CEQ';

const userLocationButton = document.querySelector('.getUserLocation');
const bottomMenu = document.querySelector('.buttomMenu');
const zoom = 8;
const maxMarkerValue = 36;
// Divided by two because markers are picked from front of array and back of array
const maxMarkers = maxMarkerValue / 2;
let location;

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
        marker: false,
        flyTo: {
            zoom: zoom * 1.45,
        },
    });

    // Geocoder on search and found a location then ->
    geocoder.on('result', async (event) => {
        // Add geocoder to map (Location finder)
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
            addMarkers(map, data);
        } catch (error) {
            // Catch error if area was already searched for and return afterwards
            console.error(error);
            return;
        }
    });

    map.on('load', async () => {
        try {
            const bigListButton = document.querySelector('.listButton');
            userLocationButton.style.display = 'flex';
            bottomMenu.style.display = 'flex';

            map.addControl(geocoder);

            bigListButton.addEventListener('click', (event) => {
                event.preventDefault();
                location.href = '/list';
            });

            userLocationButton.addEventListener('click', (event) => {
                event.preventDefault();

                const setPosition = async (position) => {
                    const center = [position.coords.longitude, position.coords.latitude];

                    map.flyTo({
                        center: center,
                        essential: true,
                        zoom: zoom * 1.45,
                    });

                    addUserLocation(map, center);

                    let coordinates = {
                        lngF: position.coords.longitude - 0.01,
                        lngS: position.coords.longitude + 0.01,
                        latF: position.coords.latitude - 0.01,
                        latS: position.coords.latitude + 0.01,
                    };

                    let id = coordinates.lngF + coordinates.latF;

                    drawRegion(map, coordinates, id);

                    const response = await fetch(
                        `/poles?lngF=${coordinates.lngF}&latF=${coordinates.latF}&lngS=${coordinates.lngS}&latS=${coordinates.latS}`,
                    );
                    const data = await response.json();

                    addMarkers(map, data);
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
            });

            // const response = await fetch(`/poles?lng=${position.lng}&lat=${position.lat}`);
            // const data = await response.json();

            // Show best pole
            // const bestPole = data.shift();
            // const HTMLMarkerBest = document.createElement('div');
            // HTMLMarkerBest.className = 'custom-marker-best-pole';
            // const bestMarker = new mapboxgl.Marker(HTMLMarkerBest, {
            //     scale: 0.5,
            // })
            //     .setLngLat([bestPole.coordinates.longitude, bestPole.coordinates.latitude])
            //     .addTo(map);

            // // Show personal position

            // // Draw line between person and best pole
            // // Add line to map
            // map.addSource('absoluteline', {
            //     type: 'geojson',
            //     lineMetrics: true,
            //     data: {
            //         type: 'Feature',
            //         properties: {
            //             title: `Afstand: ${bestPole.distance}`,
            //         },
            //         geometry: {
            //             type: 'LineString',
            //             coordinates: [
            //                 [bestPole.coordinates.longitude, bestPole.coordinates.latitude],
            //                 [position.lng, position.lat],
            //             ],
            //         },
            //     },
            // });

            // // Draw line on map
            // map.addLayer({
            //     id: 'absoluteline',
            //     type: 'line',
            //     source: 'absoluteline',
            //     layout: {
            //         'line-join': 'round',
            //         'line-cap': 'round',
            //     },
            //     paint: {
            //         'line-color': '#46BD54',
            //         'line-width': 4,
            //         'line-gradient': [
            //             'interpolate',
            //             ['linear'],
            //             ['line-progress'],
            //             0,
            //             `#46BD54`,
            //             0.75,
            //             `#46BD54`,
            //             1,
            //             `#060F2B`,
            //         ],
            //     },
            // });

            // Add all extra markers to map
            // addToMap(map, data.slice(0, maxMarkers));
        } catch (e) {
            console.error(e);
        }
    });
}

export { setupMap };
