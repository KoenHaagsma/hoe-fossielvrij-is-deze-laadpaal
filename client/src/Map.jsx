import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import './assets/scss/index.scss';
import 'mapbox-gl/dist/mapbox-gl.css';

// icons
import iconMarkerStroked from './assets/icons/png/marker-stroked.png';
import iconMarker from './assets/icons/png/marker.png';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default function Map() {
    const mapContainerRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(null);

    const [zoom, setZoom] = useState(6);
    const [markers, setMarkers] = useState();
    const [filteredMarkers, setFilteredMarkers] = useState();
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

    // Filter all markers before going on map
    useEffect(() => {
        if (!markers) return;
        (async () => {
            const filteredMarkersArray = [];
            await markers.forEach((marker) => {
                const geoJsonMarker = {
                    type: 'Feature',
                    properties: {
                        title: `${marker.operatorName} - ${marker.uniqueKey}`,
                        'marker-symbol': 'monument',
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [marker.coordinates.longitude, marker.coordinates.latitude],
                    },
                };
                filteredMarkersArray.push(geoJsonMarker);
            });
            setFilteredMarkers(filteredMarkersArray);
        })();
    }, [markers]);

    // Mount map
    useLayoutEffect(() => {
        if (mapLoaded || !currentLocation || !filteredMarkers) return;
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [currentLocation.lng, currentLocation.lat],
            zoom: zoom,
        });
        setMapLoaded(map);

        map.on('load', () => {
            map.loadImage(iconMarkerStroked, (error, image) => {
                if (error) throw error;
                map.addImage('iconMarkerStroked', image);

                map.addSource('self', {
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

                // Add a self layer
                map.addLayer({
                    id: 'self',
                    type: 'symbol',
                    source: 'self',
                    layout: {
                        'icon-image': 'iconMarkerStroked',
                        'text-field': ['get', 'title'],
                        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                        'text-offset': [0, 1.25],
                        'text-anchor': 'top',
                    },
                });
            });

            filteredMarkers.map((filteredMarker) => {
                let marker = new mapboxgl.Marker({
                    scale: 0.25,
                })
                    .setLngLat([filteredMarker.geometry.coordinates[0], filteredMarker.geometry.coordinates[1]])
                    .addTo(map);
            });
        });

        // Remove map on unmount
        return () => map.remove();
    }, [currentLocation, filteredMarkers]);

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
