import {
    getClosestNonStaticPositionedAncestor,
    getScrollOffest
} from './library.js';

export class Annotator {
    constructor(name) {
        if (!name) throw new Error('Annotator requires a name.');
        this.parent2child = new Map();
        this.taterId = name;
        this.annotationParentClassName = `${name}-annotator-container-tator`;
        this.targetSizeClass = `annotator-target-size`;
        this.elementBoxClass = `annotator-element-box`;
        this.taterLabelClassName = `annotator-label`;
        this.stylesheetId = `annotator-stylesheet-tator`;
        this.POSITIONS = {
            TOP: 'TOP',
            BOTTOM: 'BOTTOM',
            LEFT: 'LEFT',
            RIGHT: 'RIGHT'
        }
    }

    getStylesheetName() {
        return `${this.taterId}-${this.stylesheetId}`;
    }

    getTargetSizeClassName() {
        return `${this.taterId}-${this.targetSizeClass}`;
    }

    getElementBoxClassName() {
        return `${this.taterId}-${this.elementBoxClass}`;
    }

    getAnnotationParentClassName() {
        return `${this.taterId}-${this.annotationParentClassName}`;
    }

    getTaterLabelClassName() {
        return `${this.taterId}-${this.taterLabelClassName}`;
    }

    hasTaters() {
        let stylesheet = document.getElementById(this.getStylesheetName());
        let overlays = document.querySelectorAll(`.${this.getAnnotationParentClassName()}`);
        return stylesheet || overlays.length;
    }

    removeTaters() {
        console.log('removing taters');
        let stylesheet = document.getElementById(this.getStylesheetName());
        let overlays = document.querySelectorAll(`.${this.getAnnotationParentClassName()}`);
        stylesheet.remove();
        for (let overlay of overlays) {
            overlay.remove();
        }
        this.parent2child.clear();
    }

    setup() {
        // create stylesheet
        let stylesheet = document.createElement('style');
        stylesheet.id = this.getStylesheetName();
        document.head.appendChild(stylesheet);
        // create rules

        let elementBoxRule =
            `.${this.getElementBoxClassName()} {`
            + ` position: absolute;`
            + " background: rgba(0,0,0,0.1)!important;"
            + " border: 3px solid rgba(0,0,0,0.8);"
            + `}`;
        let overlayRule =
            `.${this.getAnnotationParentClassName()} {`
            + ' position: absolute;'
            + ' z-index: 100;'
            + ' top: 0;'
            + ' bottom: 0;'
            + ' left: 0;'
            + ' right: 0;'
            + ' pointer-events: none;'
            + '}';
        let overlayDescendantsRule =
            `.${this.getAnnotationParentClassName()} * {`
            + ' pointer-events: all;'
            + '}';
        let overlayLabelRule =
            `.${this.getTaterLabelClassName()} {`
            + ` position: absolute;`
            + ` top: 0;`
            + ` transform: translate(-3px, -100%);`
            + ` margin: 0!important;`
            + ` color: white;`
            + ` background: rgba(0,0,0,0.8)!important;`
            + ` padding: 0.1rem 0.5rem;`
            + `}`;
        document.documentElement.style.position = 'relative!important';
        // add rules
        // stylesheet.sheet.insertRule(targetSizeRule);
        stylesheet.sheet.insertRule(elementBoxRule);
        stylesheet.sheet.insertRule(overlayRule);
        stylesheet.sheet.insertRule(overlayDescendantsRule);
        stylesheet.sheet.insertRule(overlayLabelRule);
        return this.exists = true;
    }

    /**
     * Given a list of elements and a callback to create the annotation, annotates the webpage
     * @param {Array<HTMLElement>} listOfElements list of elements to annotate
     * @param {Function} annotationCallback parameter 1 = the element to annotate, parameter 2 = the closest parent element with a non-static position, must return an HTMLElement
     * @param {Function} onClickCallback (event object, annotationElement, anotatedElement, parent of anotatedElement) called on click
     * @param {String} annotationLabel text that labels the annotation
     * @param {annotater.POSITIONS} annotationPosition the position of the label Defaults to top
     */
    annotateElements(listOfElements, annotationCallback, onClickCallback, annotationLabel, labelPosition = this.POSITIONS.TOP) {
        //console.log("list of eles: ", listOfElements);
        // Organize list of elements by closest parent element that has a non-static CSS position
        for (const element of listOfElements) {
            let [parent, positionType] = getClosestNonStaticPositionedAncestor(element);
            if (!this.parent2child.has(parent)) {
                this.parent2child.set(parent, { position: positionType, children: [] });
            }
            this.parent2child.get(parent).children.push(element);
        }

        // create the overlay and annotations
        for (const [parent, parentProperties] of this.parent2child.entries()) {
            // create an overlay layer for the parent element
            let overlay = this.makeOverlay(parent);

            for (const child of parentProperties.children) {
                // make annotation

                //let tater = makeTater(child, parent);
                let [annotation, labelText] = annotationCallback(child, parent);
                this.positionAnnotation(annotation, child, parent, parentProperties.position);
                annotation.addEventListener('click', (e) => {
                    console.log(this.getSelector(child));
                    console.log(child);
                    if (e.getModifierState('Control')) child.click();
                    setTimeout(() => onClickCallback(e, annotation, child, parent), 5);
                });
                let label = this.makeLabel(labelText);
                overlay.append(annotation, label);
                this.repositionAnnotation(child, annotation, overlay);
            }
        }
    }

    repositionAnnotation(element, annotation, overlay) {
        // reset the styling
        annotation.style.removeProperty('white-space');
        // get annotation dimensions
        let annotationRect = annotation.getBoundingClientRect();
        let elementRect = element.getBoundingClientRect();

        // set the width of subannotations equal to parent
        if (annotationRect.width < elementRect.width) {
            let width = elementRect.width;
            if (width < 50) width = 50;
            annotation.style.width = width + 'px';
            annotation.style.whiteSpace = 'normal';
        }
        // we may have changed to size, so we want to updated the rect
        // so that we can ensure that it is fully within the viewport
        // and does not cause horizontal scrolling (this is important for
        // 1.4.10 Reflow)
        annotationRect = annotation.getBoundingClientRect();
        // this assumes that the documentElement is the HTML element
        // clientWidth will include everything but the vertical scrollbar
        // when used on the html element
        let vw = document.documentElement.clientWidth;
        if (annotationRect.width > vw || annotationRect.x + annotationRect.width > vw) {
            let widthOffset, leftOffset;
            let twoPercentVW = (2 * (vw / 100));
            widthOffset = vw - 2 * twoPercentVW;
            leftOffset = twoPercentVW - elementRect.x;
            annotation.style.width = widthOffset + 'px';
            annotation.style.left = leftOffset + 'px';
            // in the style sheet we've set the "white-space" CSS property
            // to nowrap, but when the text is longer than the width of the
            // viewport, we need to wrap the text
            annotation.style.whiteSpace = 'normal';
        }
    }

    makeLabel(text) {
        let label = document.createElement('div');
        label.textContent = text;
        label.classList.add(this.getTaterLabelClassName());
        return label;
    }

    makeOverlay(element) {
        let overlay = document.createElement('div');
        overlay.classList.add(this.getAnnotationParentClassName());
        element.appendChild(overlay);
        return overlay;
    }

    positionAnnotation(annotation, annotatedElement, annotatedElementParent, annotatedElementParentPosition) {
        let elementRect = annotatedElement.getBoundingClientRect();
        let parentRect = annotatedElementParent.getBoundingClientRect();
        let [scrollXOffset, scrollYOffest] = [0, 0];

        if (annotatedElementParentPosition !== 'static') {
            [scrollXOffset, scrollYOffest] = getScrollOffest(annotatedElement, annotatedElementParent);
        }
        // set element box location

        let top = elementRect.top - parentRect.top + scrollYOffest;
        let left = elementRect.left - parentRect.left + scrollXOffset;
        annotation.style.top = top - (3 * 2) + 'px';
        annotation.style.left = left - (3 * 2) + 'px';
        annotation.style.width = elementRect.width + 3 * 4 + 'px';
        annotation.style.height = elementRect.height + 3 * 4 + 'px';
    }
}