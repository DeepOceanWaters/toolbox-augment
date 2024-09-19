import { Annotator } from "./annotator.js";

export function main() {
    let annotater = new Annotator('alt-text');

    const _main = () => {
        if (annotater.hasTaters()) {
            annotater.removeTaters();
            return;
        }
        console.log(getListOfElements());
        loadAnnoations();
    }

    const getListOfElements = () => {
        let elements = [...document.querySelectorAll('img')];
        elements.push(...document.querySelectorAll('[role="img"]'));
        elements.push(...document.querySelectorAll('svg'));

        // taken from stack overflow, finds all DIVs using background: url()
        let divs = document.querySelectorAll("div");

        let urlRegex = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/;

        var divsWithBackgroundImage = [...divs].filter((div) => {
            let backgroundImage = getComputedStyle(div).getPropertyValue("background-image");

            return (backgroundImage.match(urlRegex));
        });
        // end taken from stack overflow
        elements.push(...divsWithBackgroundImage);
        return elements;
    }

    const reloadAnnotations = (e) => {
        annotater.removeTaters();
        loadAnnoations();
    }

    const onClickCallback = (e, annotation, img, parent) => {
        console.log(`ALT TEXT: ${getAltText(img)}`, img);
        reloadAnnotations();
    }

    const loadAnnoations = () => {
        annotater.setup();
        let imgs = getListOfElements();
        annotater.annotateElements(imgs, makeTargetSize, onClickCallback);
    }

    const makeTargetSize = (img, parentElement) => {
        let elementBox = document.createElement('div');
        let altText = document.createElement('p');
        altText.textContent = getAltText(img);
        elementBox.classList.add(annotater.getElementBoxClassName());
        altText.classList.add(annotater.getTaterLabelClassName());
        //elementBox.appendChild(altText);

        return [elementBox, getAltText(img)];
    }

    /**
     * must update
     * @param {HTMLElement} element 
     * @returns labelledby acc name
     */
    const getNameFromAriaLabelledby = (element, visitedElements = []) => {
        let names = [];
        let ids = element.getAttribute('aria-labelledby').split(' ');
        const findName = (id) => {
            let name;
            let el = document.getElementById(id);
            console.log(id, el)
            if (el === element && !!el.getAttribute('aria-label')) {
                console.log('setting name to aria-label');
                name = el.getAttribute('aria-label');
            }
            else if (el.hasAttribute('aria-labelledby') && !visitedElements.includes(el)) {
                console.log('ve', visitedElements);
                visitedElements.push(element);
                name = getNameFromAriaLabelledby(el, visitedElements);
            }
            else {
                console.log('setting name to text content');
                name = el.textContent;
            }
            if (name) names.push(name);
        }
        console.log('ids', ids);
        if (visitedElements.includes(element)) {
            findName(element.id);
        }
        else {
            for (const id of ids) {
                findName(id);
            }
        }
        console.log('names', names);
        return names.join(' ');
    }

    /**
     * Gets the alt text for an img, non-exhaustive, does not handle
     * complex names (e.g. simplified version of the acc name computation,
     * does not handle aria-labelledby an element that has it's own complex
     * aria-labelledby naming computation)
     * @param {IMGElement} img 
     * @returns 
     */
    const getAltText = (img) => {
        let altText;
        if (img.getAttribute('aria-hidden') === 'true') {
            altText = '[HIDDEN - aria-hidden=true]';
        }
        else if (img.tagName === 'IMG' || img.tagName.toUpperCase() === 'SVG') {
            if (img.hasAttribute('aria-labelledby')) {
                altText = getNameFromAriaLabelledby(img)
            }
            else if (img.getAttribute('aria-label')) {
                altText = img.getAttribute('aria-label');
            }
            else if (img.tagName.toUpperCase() === 'SVG') {
                if (svgHasNonEmptyTitle(img)) {
                    altText = img.querySelector('title').textContent;
                }
                else {
                    altText = '[HIDDEN - SVG with no TITLE]';
                }
            }
            else if (!img.hasAttribute('alt')) {
                altText = '[No ALT attribute, no known text alternative]';
            }
            else if (img.hasAttribute('alt') && img.alt === '') {
                altText = '[HIDDEN - empty alt]';
            }
            else {
                altText = img.alt;
            }
        }
        else if (img.getAttribute('role') === 'img') {
            if (img.hasAttribute('aria-labelledby')) {
                altText = getNameFromAriaLabelledby(img)
            }
            else if (img.getAttribute('aria-label')) {
                altText = img.getAttribute('aria-label');
            }
        }
        else if (img.tagName === 'DIV') {
            altText = img.textContent || 'DIV bg image - NO ALT INSIDE';
        }
        else {
            altText = `unknown img type (tag = ${img.tagName})`;
        }
        return altText;
    }

    const svgHasNonEmptyTitle = (svg) => {
        let title = svg.querySelector('title');
        return !!(title?.textContent);
    }

    _main();


    const findAllNonStaticElements = (element) => {
        let nonStaticElements = [];
        for (let child of element.children) {
            let style = window.getComputedStyle(child);
            if (style.getPropertyValue('position') !== 'static') {
                nonStaticElements.push(child);
            }
            nonStaticElements.push(...findAllNonStaticElements(child));
        }
        return nonStaticElements;
    }

    const createLayers = (nonStaticlyPositionedElements, root) => {
        let layers = [];
        let processedElements = new Set();
        for (let element of nonStaticlyPositionedElements) {
            // create layer for current element
            // trace current element's ancestors and see if any are contained within nonStaticly...
            // if they are create a layer for them, and repeat step 1 for new layer
            let layer = createOverlayItem(element);
            layers.push(layer);
            let ancestor = getClosestAncestorAlsoInArray(nonStaticlyPositionedElements, element);
            if (ancestor) {

            }
            else {
                root.appendChild(layer);
            }
        }
        return layers;
    }

    const getClosestAncestorAlsoInArray = (arr, element) => {
        while ((element = element.parentElement) !== document.documentElement) {
            if (arr.includes(element)) break;
        }
        return element;
    }

    const createOverlayItem = (element, position) => {
        let overlay = document.createElement('div');
        let elementRect = element.getBoundingClientRect();
        overlay.style.top = elementRect.y + 'px';
        overlay.style.left = elementRect.x + 'px';
        overlay.style.width = elementRect.width + 'px';
        overlay.style.height = elementRect.height + 'px';
        overlay.style.position = position || window.getComputedStyle(element).getPropertyValue('position');
        return overlay;
    }
}