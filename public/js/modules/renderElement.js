function renderElementAndClean(parent, html, position) {
    while (parent.firstChild) {
        parent.firstChild.remove();
        console.log('cleaned');
    }
    parent.insertAdjacentHTML(position, html);
    console.log('cleaned All');
}

function renderElement(parent, html, position) {
    parent.insertAdjacentHTML(position, html);
}

function cleanElement(parent) {
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
}

export { renderElementAndClean, renderElement, cleanElement };
