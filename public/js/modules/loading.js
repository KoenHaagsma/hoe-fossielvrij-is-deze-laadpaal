import { renderElementAndClean, renderElement, cleanElement } from './renderElement.js';

const loadingHTML = `<h2 class='animate'>Loading</h2>`;

const Loading = {
    start: (parent) => {
        renderElement(parent, loadingHTML, 'afterbegin');
    },
    remove: () => {
        const loader = document.querySelector('.animate');
        if (!loader) return;
        loader.remove();
    },
};

export { Loading };
