function drawRegion(map, coordinates, id) {
    // Draw box around searched area
    map.addSource(`searchedregion-${id}`, {
        type: 'geojson',
        data: {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                // Top left, Top right, Bottom right, Bottom left, Top Left.
                coordinates: [
                    [
                        [coordinates.lngF, coordinates.latS],
                        [coordinates.lngS, coordinates.latS],
                        [coordinates.lngS, coordinates.latF],
                        [coordinates.lngF, coordinates.latF],
                        [coordinates.lngF, coordinates.latS],
                    ],
                ],
            },
        },
    });

    // Fill the polygon area
    map.addLayer({
        id: `searchedregion-${id}`,
        type: 'fill',
        source: `searchedregion-${id}`,
        layout: {},
        paint: {
            'fill-color': '#46BD54',
            'fill-opacity': 0.25,
        },
    });

    // Add a outline around the polygon area
    map.addLayer({
        id: `outline-${id}`,
        type: 'line',
        source: `searchedregion-${id}`,
        layout: {},
        paint: {
            'line-color': '#46BD54',
            'line-width': 1,
        },
    });
}

export { drawRegion };
