function renderElementAndClean(parent, html, position) {
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
    parent.insertAdjacentHTML(position, html);
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
