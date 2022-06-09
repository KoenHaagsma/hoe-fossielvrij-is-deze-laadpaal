import { addToMap } from './addToMap.js';
mapboxgl.accessToken = 'pk.eyJ1Ijoia29lbmhhYWdzbWEiLCJhIjoiY2wzbjNuY255MGF3ODNwbnl2amJuYms4MCJ9.QD5jhV_KLgBjGYcGOFnwTg';

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

            // Show best pole
            const bestPole = data.shift();
            const HTMLMarkerBest = document.createElement('div');
            HTMLMarkerBest.className = 'custom-marker-best-pole';
            const bestMarker = new mapboxgl.Marker(HTMLMarkerBest, {
                scale: 0.5,
            })
                .setLngLat([bestPole.coordinates.longitude, bestPole.coordinates.latitude])
                .addTo(map);
            console.log(bestPole.score);

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
            const maxMarkers = 15;
            addToMap(map, data.slice(0, maxMarkers));
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

export { setupMap };
