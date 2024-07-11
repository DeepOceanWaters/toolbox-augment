export function getClosestNonStaticPositionedAncestor(element) {
    let position = 'static';
    // NOTE: per shadow root: if an element is in a shadowroot, must replace when element === null with element that is the shadowroot
    while (position === 'static' && element !== document.documentElement) {
        element = element.parentElement;
        let style;
        try {
            style = window.getComputedStyle(element);
        } catch (e) {
            console.log('tried on this ele: ', element);
            throw e;
        }
        position = style.getPropertyValue('position');
    }
    // should we return null, or just return the html element?
    return [element, position];
}

export function getListOfNonStaticPositionedAncestors(element) {
    let [ancestor, position] = [element, 'static'];
    let ancestors = [];
    while (([ancestor, position] = getClosestNonStaticPositionedAncestor(element))[0]
        !== document.documentElement) {
        ancestors.push([ancestor, position]);
    }
    return ancestors;
}

export function getScrollOffest(element, boundingParent = document.documentElement) {
    let scrollYOffest, scrollXOffset;

    const getScroll = (el, scrollProperty) => {
        while (el[scrollProperty] <= 0 && el !== boundingParent) {
            el = el.parentElement;
        }
        return el[scrollProperty]
    }

    scrollYOffest = getScroll(element, "scrollTop");
    scrollXOffset = getScroll(element, "scrollLeft");
    return [scrollXOffset, scrollYOffest];
}

export function isFocusable(element) {
    // is not inert or contained within an inert element
    // tabindex = 0
    // is not contained within a closed details
    // if contained within closed details, must be a summary
    // also need to ensure that closed details with a summary 
    // is excluded if that details is in another closed details.
    let isTabbable = element.tabIndex === 0;
    // closest also checks the element, not just its ancestors
    let isInInert = element.closest('[inert]');
    let detailsStart = element;
    if (element.tagName === 'SUMMARY') {
        let parentDetails = element.closest('details')?.parentElement;
        if (!parentDetails) {
            console.warn('malformed html, no <details> parent for <summary> element:', element);
            return false;
        }
        detailsStart = parentDetails;
    }
    let closestClosedAncestorDetails = detailsStart.closest('details:not([open])');
    return isTabbable && !isInInert && !closestClosedAncestorDetails;
}

export function findShadowRoots(element = document.documentElement) {
    let shadowRootElements = [element];
    this._findShadowRoots(element, shadowRootElements);
    return shadowRootElements;
}

export function _findShadowRoots(element, outputArray) {
    for (const child of element.children) {
        if (child.shadowRoot) {
            outputArray.push(child.shadowRoot);
        }
        this._findShadowRoots(child, outputArray);
    }
}


/** from microlib */
export function getSelectorHelper(element) {
    let selector = element.tagName;
    let selectorUniqueAttrs = ''; // id, class e.g. tagname#spots.dog
    let selectorAttrs = ''; // where css uses brackets e.g. tagname[data-dog-name="spots"]
    let usedAttrs = [];
    if (element.id) selectorUniqueAttrs += `#${element.id.trim()}`;
    for (const attr of [...element.attributes]) {
        selectorAttrs += `[${attr.name}="${attr.value.trim()}"]`;
        usedAttrs.push(attr.name);
        if (document.querySelectorAll(selector + selectorUniqueAttrs + selectorAttrs).length === 1) break;
    }
    return element.tagName + selectorUniqueAttrs + selectorAttrs;
}

/**
 * Gets a CSS selector that uniquely selects this component
 * @param {HTMLElement} element 
 */
export function getSelector(element) {
    let selector = this.getSelectorHelper(element);
    let currentElement = element;
    while (document.querySelectorAll(selector).length > 1 && currentElement !== document.body) {
        currentElement = currentElement.parentElement;
        let parentSelector = this.getSelectorHelper(currentElement);
        selector = parentSelector + ' > ' + selector;
    }
    return selector;
}

export function getElementStyle(element) {
    if (!element) throw new Error('no element found. Please focus an element to get its styles');
    let elementStyle = window.getComputedStyle(element);
    // convert from px to pt, getPropertyValue should get the used value which should always be in px
    const fontSize = Number(elementStyle.getPropertyValue('font-size').replace('px', '')) * 0.75;
    // 700 or higher is bold
    const fontWeight = Number(elementStyle.getPropertyValue('font-weight'));
    // given the font-size and font-weight, determine if this content is "large-scale"
    // given the WCAG definition of "large-scale"
    const isLargeScale = !!(fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700));
    let color = elementStyle.getPropertyValue('color');
    let text = `color: ${color}\n`
             + `font-size: ${fontSize}pt\n`
             + `font-weight: ${fontWeight}\n`
             + `is large-scale: ${isLargeScale}`;
    console.log(text);
    return {
        color: color,
        fontSize: fontSize,
        fontWeight: fontWeight,
        isLargeScale: isLargeScale
    }
}

export function htmlEscape(text) {
    return HTMLEscapeUnescape(text, true);
}

export function htmlUnescape(text) {
    return HTMLEscapeUnescape(text, false);
}

function HTMLEscapeUnescape(text, escape) {
    let unescaped2escaped = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
    for (let [unescaped, escaped] of Object.entries(unescaped2escaped)) {
        if (escape) text = text.replaceAll(unescaped, escaped);
        else        text = text.replaceAll(escaped, unescaped);
    }
    return text;
}