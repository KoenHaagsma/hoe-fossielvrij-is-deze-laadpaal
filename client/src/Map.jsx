import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import './assets/scss/index.scss';
import 'mapbox-gl/dist/mapbox-gl.css';

// icons
import iconMarker from './assets/icons/png/marker-stroked.png';

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

export default function Map() {
    const mapContainerRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(null);

    const [zoom, setZoom] = useState(6);
    const [markers, setMarkers] = useState();
    const [currentLocation, setCurrentLocation] = useState();

    // Get current position
    useEffect(() => {
        (async () => {
            const setPosition = (position) => {
                setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
            };

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(setPosition);
            } else {
                return false;
            }
        })();
    }, []);

    // Fetch loadingpoles close to current position
    useEffect(() => {
        if (!currentLocation) return;
        (async () => {
            const url = `http://localhost:4242/sr?lng=${currentLocation.lng}&lat=${currentLocation.lat}`;
            console.log(url);
            const response = await fetch(url);
            const data = await response.json();
            setMarkers(data);
        })();
    }, [currentLocation]);

    // Mount map
    useLayoutEffect(() => {
        if (mapLoaded || !currentLocation) return;
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [currentLocation.lng, currentLocation.lat],
            zoom: zoom,
        });
        setMapLoaded(map);

        map.on('load', () => {
            map.loadImage(iconMarker, (error, image) => {
                if (error) throw error;
                map.addImage('iconMarker', image);

                map.addSource('points', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [
                            {
                                type: 'Feature',
                                properties: {
                                    title: 'Center (You)',
                                    'marker-symbol': 'monument',
                                },
                                geometry: {
                                    type: 'Point',
                                    coordinates: [currentLocation.lng, currentLocation.lat],
                                },
                            },
                        ],
                    },
                });

                // Add a symbol layer
                map.addLayer({
                    id: 'points',
                    type: 'symbol',
                    source: 'points',
                    layout: {
                        'icon-image': 'iconMarker',
                        'text-field': ['get', 'title'],
                        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                        'text-offset': [0, 1.25],
                        'text-anchor': 'top',
                    },
                });
            });
        });

        // Remove map on unmount
        return () => map.remove();
    }, [currentLocation]);

    return (
        <div>
            <div className="sidebar">
                {currentLocation &&
                    `Current location: latitude: ${currentLocation.lat} | longitude: ${currentLocation.lng}`}
            </div>
            <div ref={mapContainerRef} className="map-container" />
        </div>
    );
}
