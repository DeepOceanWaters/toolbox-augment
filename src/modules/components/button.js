export default function makeButton(text, type, { extraClasses, srOnlyText }) {
    let btn = document.createElement('button');
    let innerDiv = document.createElement('div');
    innerDiv.classList.add('btn');
    if (type) innerDiv.classList.add(type);
    if (extraClasses) {
        let arr = typeof extraClasses === 'string' ? [extraClasses] : extraClasses; 
        innerDiv.classList.add(...extraClasses);
    }
    innerDiv.textContent = text;
    if (srOnlyText) {
        let srOnly = document.createElement('span');
        srOnly.classList.add('sr-only');
        srOnly.textContent = srOnlyText;
        innerDiv.appendChild(srOnly);
    }
    btn.appendChild(innerDiv);
    return btn;
}
/*export default class Button {
    // tooltip - is name or is desc
    // expanded
    // haspopup
    // pressed
    // describedby

    constructor({
        ariaExpanded,
        ariaHaspopup,
        ariaPressed,
        ariaDescribedby,
        ariaLabel,
        ariaLabelledby,
        nameIsTooltip,
        descriptionIsTooltip
    }) {

    }
}*/