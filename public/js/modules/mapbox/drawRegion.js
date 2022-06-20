import { Loading } from '../loading.js';

function drawRegion(map, coordinates, id) {
    // Draw box around searched area
    try {
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
    } catch (e) {
        Loading.remove();
        return;
    }
}

export { drawRegion };
