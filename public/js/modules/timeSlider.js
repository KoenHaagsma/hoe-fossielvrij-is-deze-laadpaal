function timeSlider(map, markers) {
    const slider = document.querySelector('#time');
    const sources = map.getStyle().sources;
    // https://stackoverflow.com/a/53443378
    const filteredSources = (({ composite, ...o }) => o)(sources);
    slider.removeEventListener('input', event);

    slider.addEventListener('input', (event) => {
        event.preventDefault();
        const bestPoles = document.querySelectorAll('.custom-marker-best-pole');
        bestPoles.forEach((pole) => {
            console.log(pole);
            pole.classList.replace(pole.classList[1], pole.markerTimeFrame[slider.value]);
        });

        for (const [key, value] of Object.entries(filteredSources)) {
            let bestMarkerScore = 720;
            let bestPole;
            let markersInPolygon = [];

            const polygonValues = value.data.geometry.coordinates;
            const polygon = turf.polygon([polygonValues[0]]);

            markers.forEach((marker) => {
                const point = turf.point([marker.coordinates[0], marker.coordinates[1]]);
                const ifIsInPolygon = turf.booleanPointInPolygon(point, polygon);
                if (!ifIsInPolygon) return;
                markersInPolygon.push(marker);
            });

            markersInPolygon.forEach((markers) => {
                if (markers.markerTimeScore[slider.value] < bestMarkerScore) {
                    bestMarkerScore = markers.markerTimeScore[slider.value];
                    bestPole = markers;
                }
                markers.classList.replace(markers.classList[1], `marker-${markers.markerTimeFrame[slider.value]}`);
            });

            bestPole.classList.replace(bestPole.classList[1], 'custom-marker-best-pole');
        }
    });
}

export { timeSlider };
