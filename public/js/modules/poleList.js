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
    let bestPoles = [];

    const regionValue = parseInt(document.querySelector('#region').value);
    allMarkers.forEach((marker) => {
        marker.classList.remove('focused');
    });

    bestPoles = allMarkersArray.slice(
        regionValue === 1 ? regionValue - 1 : (regionValue - 1) * 10,
        allMarkersArray.length,
    );

    const regionInput = document.querySelector('#region');
    regionInput.addEventListener('input', () => {
        console.log(regionValue);
    });

    const listContainer = document.querySelector('.list-container');
    listContainer.classList.remove('disabled');
    const sliderContainer = document.querySelector('.slider');

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
                zoom: zoom * 2,
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
        console.log('unobserved');
    } else {
        targets.forEach((target) => {
            observer.observe(target);
        });
        console.log('observed');
    }
}

export { poleList };
