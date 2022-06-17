// import { renderElementAndClean, renderElement, cleanElement } from './renderElement.js';

const bigListButton = document.querySelector('.listButton');
const openButton = document.querySelector('.openMenu ');
let isOpen = false;

function poleList(map, clicked, zoom, allMarkers) {
    // Check if list is open or closed
    if (clicked % 2 === 0) {
        isOpen = true;
    } else {
        isOpen = false;
    }

    const allMarkersArray = [...allMarkers];
    const maxPolesList = 11;
    let bestPoles = [];

    allMarkers.forEach((marker) => {
        marker.classList.remove('focused');
    });

    if (allMarkersArray.length < maxPolesList) {
        bestPoles = allMarkersArray;
    } else {
        bestPoles = allMarkersArray.slice(1, maxPolesList);
    }

    const listContainer = document.querySelector('.list-container');
    listContainer.classList.remove('disabled');
    // const slider = document.querySelector('#time');
    const sliderContainer = document.querySelector('.slider');

    // const HTML = `
    // <ol>
    //     ${bestPoles
    //         .map(
    //             (bestPole, index) =>
    //                 `<li class='${index} marker-${bestPole.markerTimeFrame[slider.value]}'>
    //                     <section><p>${index + 1}.</p><p>Laadpaal - ${bestPole.provider}</p></section>
    //                     <section><p>Nu: <div class="power-${
    //                         bestPole.markerTimeFrame[slider.value]
    //                     }"></div></p></section>
    //                     <section><a target="_blank" href="http://www.google.com/maps/place/${bestPole.coordinates[1]},${
    //                     bestPole.coordinates[0]
    //                 }">Navigeer naar paal &#8594</a></section>
    //                 </li>`,
    //         )
    //         .join('\n ')}
    // </ol>
    // `;

    // renderElementAndClean(listContainer, HTML, 'afterbegin');
    bigListButton.classList.toggle('extended');
    sliderContainer.classList.toggle('extended');
    openButton.classList.toggle('extended');

    // Intersection observer to let the map go to the point that is being hovered in the list.
    const IOOPTIONS = {
        threshold: 1.0,
    };

    let observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const index = entry.target.classList[0];
            map.flyTo({
                center: bestPoles[index].coordinates,
                essential: true,
                zoom: zoom * 1.75,
            });
            bestPoles.forEach((pole) => {
                pole.classList.remove('focused');
            });
            bestPoles[index].classList.add('focused');
        });
    }, IOOPTIONS);
    let targets = document.querySelectorAll('.list-container > ol li');

    if (!isOpen) {
        targets.forEach((target) => {
            observer.unobserve(target);
        });
    } else {
        targets.forEach((target) => {
            observer.observe(target);
        });
    }
}

export { poleList };
