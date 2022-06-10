import { addToMap } from './addToMap.js';
mapboxgl.accessToken = 'pk.eyJ1Ijoia29lbmhhYWdzbWEiLCJhIjoiY2w0OGptdnNoMGQ5dDNrcjJhdzB0NG5wMCJ9.l2fZnsgmtiTsrRW_f28CEQ';

const userLocationButton = document.querySelector('.getUserLocation');
const bottomMenu = document.querySelector('.buttomMenu');

function setupMap(position) {
    const zoom = 12;
    const maxMarkers = 100;
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
            zoom: zoom,
        },
    });

    geocoder.on('result', async (event) => {
        console.log(event);
        const lngLat = [event.result.center[0], event.result.center[1]];
        const response = await fetch(`/poles?lng=${lngLat[0]}&lat=${lngLat[1]}`);
        const data = await response.json();

        if (!data || data === undefined || data.length === 0) return;

        // Show best pole
        const bestPole = data.shift();
        const HTMLMarkerBest = document.createElement('div');
        HTMLMarkerBest.className = 'custom-marker-best-pole';
        const bestMarker = new mapboxgl.Marker(HTMLMarkerBest, {
            scale: 0.5,
        })
            .setLngLat([bestPole.coordinates.longitude, bestPole.coordinates.latitude])
            .addTo(map);

        addToMap(map, data.slice(0, maxMarkers));
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

            const response = await fetch(`/poles?lng=${position.lng}&lat=${position.lat}`);
            const data = await response.json();

            // Show best pole
            const bestPole = data.shift();
            const HTMLMarkerBest = document.createElement('div');
            HTMLMarkerBest.className = 'custom-marker-best-pole';
            const bestMarker = new mapboxgl.Marker(HTMLMarkerBest, {
                scale: 0.5,
            })
                .setLngLat([bestPole.coordinates.longitude, bestPole.coordinates.latitude])
                .addTo(map);

            // Show personal position
            const HTMLMarkerPersonal = document.createElement('div');
            HTMLMarkerPersonal.className = 'custom-marker-personal';
            const personalMarker = new mapboxgl.Marker(HTMLMarkerPersonal, {
                scale: 0.5,
            })
                .setLngLat([position.lng, position.lat])
                .addTo(map);

            // Draw line between person and best pole
            // Add line to map
            map.addSource('absoluteline', {
                type: 'geojson',
                lineMetrics: true,
                data: {
                    type: 'Feature',
                    properties: {
                        title: `Afstand: ${bestPole.distance}`,
                    },
                    geometry: {
                        type: 'LineString',
                        coordinates: [
                            [bestPole.coordinates.longitude, bestPole.coordinates.latitude],
                            [position.lng, position.lat],
                        ],
                    },
                },
            });

            // Draw line on map
            map.addLayer({
                id: 'absoluteline',
                type: 'line',
                source: 'absoluteline',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                paint: {
                    'line-color': '#46BD54',
                    'line-width': 4,
                    'line-gradient': [
                        'interpolate',
                        ['linear'],
                        ['line-progress'],
                        0,
                        `#46BD54`,
                        0.75,
                        `#46BD54`,
                        1,
                        `#060F2B`,
                    ],
                },
            });

            // Add all extra markers to map
            addToMap(map, data.slice(0, maxMarkers));
        } catch (e) {
            console.error(e);
        }
    });
}

export { setupMap };
