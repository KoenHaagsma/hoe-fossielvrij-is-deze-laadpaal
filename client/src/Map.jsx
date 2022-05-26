import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import './assets/scss/index.scss';

mapboxgl.accessToken = 'pk.eyJ1Ijoia29lbmhhYWdzbWEiLCJhIjoiY2wzbjNuY255MGF3ODNwbnl2amJuYms4MCJ9.QD5jhV_KLgBjGYcGOFnwTg';

export default function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(5.433048);
    const [lat, setLat] = useState(52.295109);
    const [zoom, setZoom] = useState(6);
    const [markers, setMarkers] = useState();
    const [marker, setMarker] = useState();

    useEffect(() => {
        (async () => {
            const url = `http://localhost:4242/sr?lng=${lng}&lat=${lat}`;
            console.log(url);
            const response = await fetch(url);
            const data = await response.json();
            setMarkers(data);
        })();
    }, []);

    useEffect(() => {
        console.log(markers);
    }, [markers]);

    useLayoutEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom,
        });
    });

    useLayoutEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    return (
        <div>
            <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}
