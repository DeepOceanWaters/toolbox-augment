/* rgb coefficients for determining luminance as defined by WCAG */
export var rCof = 0.2126;
export var gCof = 0.7152;
export var bCof = 0.0722;
export var hexRegex = /([A-F]|[a-f]|\d){6}/g;

// hslHueRang = [start, end)
export var colorful = {
    colors: {
        red: {          "hsl":[  3,50,50],"hueRange":[355,10 ]},
        pinkRed: {      "hsl":[350,50,50],"hueRange":[346,355]},
        pink: {         "hsl":[338,50,50],"hueRange":[331,345]},
        magentaPink: {  "hsl":[325,50,50],"hueRange":[321,330]},
        magenta: {      "hsl":[300,50,50],"hueRange":[281,320]},
        blueMagenta: {  "hsl":[260,50,50],"hueRange":[241,280]},
        blue: {         "hsl":[230,50,50],"hueRange":[221,240]},
        cyanBlue: {     "hsl":[210,50,50],"hueRange":[201,220]},
        cyan: {         "hsl":[185,50,50],"hueRange":[170,200]},
        greenCyan: {    "hsl":[150,50,50],"hueRange":[141,169]},
        green: {        "hsl":[110,50,50],"hueRange":[81, 140]},
        yellowGreen: {  "hsl":[ 70,50,50],"hueRange":[61, 80 ]},
        yellow: {       "hsl":[ 55,50,50],"hueRange":[51, 60 ]},
        orangeYellow: { "hsl":[ 45,50,50],"hueRange":[41, 50 ]},
        orange: {       "hsl":[ 30,50,50],"hueRange":[21, 40 ]},
        redOrange: {    "hsl":[ 15,50,50],"hueRange":[11, 20 ]}
    },
    sortFunctions: {
        hues: hue,
        saturation: sat,
        lumhsl: lumHSL,
        luminance: lum,
        red: (rgb) => { return rgb[0] },
        green: (rgb) => { return rgb[1] },
        blue: (rgb) => { return rgb[2] },
        chosen: sat
    },

    init: function() {
        this.choose = this.choose.bind(this);

        delete this.init;
        return this;
    },

    choose: function(name) {
        if (this.sortFunctions.hasOwnProperty(name)) {
            this.sortFunctions.chosen = this.sortFunctions[name];
        }
        else {
            console.warn(`No function with name: ${name}`);
        }
    }
}.init();

/**
 * Find the ratio between two rgb colors.
 * @param {Number[]} rgb1 Array length 3 [r, g, b]
 * @param {Number[]} rgb2 Array length 3 [r, g, b]
 * @returns (Number) X:1 contrast ratio between the two colors
 */
export function ratio(rgb1, rgb2) {
    let L1 = lum(rgb1);
    let L2 = lum(rgb2);
    if (L2 > L1) {
        [L1, L2] = [L2, L1];
    }
    return (L1 + 0.05) / (L2 + 0.05);
}

/**
 * Takes an rgb value and returns the luminance value as defined
 * by WCAG.
 * @param {Number[]} rgb [red, green, blue] rgb color array
 * @returns luminance of the given rgb color array
 */
export function lum(rgb) {
    if (typeof rgb === 'number') {
        return rgb;
    }
    let r, g, b;
    [r, g, b] = rgb.map(v => v / 255);
    [r, g, b] = [r, g, b].map(v => 
        v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    );
    return rCof * r + gCof * g + bCof * b;
}

/**
 * Mathematically alter a color as required by the WCAG equation. 
 * Likely related to gamma correction of sRGB.
 * @param {Number} color A color axis (red, green, or blue in most cases)
 * @returns mathematically altered (sifted) color
 */
export function siftColor(color) {
    color = color / 255;
    return color <= 0.04045 ? color / 12.92 : Math.pow((color + 0.055) / 1.055, 2.4);
}

/**
 * Takes a hexcode string and converts it into an rgb value.
 * @param {String} hexcode the hexcode with or without #.
 * @returns [red, green, blue] rgb color array
 */
export function hex2rgb(hexcode) {
    let newHexcode = hexcode;
    if (typeof hexcode !== 'string') {
        throw new Error(`Expected hexcode to be string, instead got: ${typeof hexcode} for ${hexcode}`);
    }
    if (hexcode.length < 6 || hexcode.length > 7) { 
        throw new Error(`Improperly formatted hexcode: ${hexcode}`); 
    }
    if (hexcode[0] === '#') { 
        newHexcode = hexcode.slice(1); 
    }

    let red, green, blue;

    red = parseInt(newHexcode.slice(0,2), 16);
    green = parseInt(newHexcode.slice(2,4), 16);
    blue = parseInt(newHexcode.slice(4,6), 16);

    return [red, green, blue];
}

/**
 * Takes rgb and returns hexcode.
 * @param {Number[]} rgb rgb color array
 * @returns hexcode for rgb
 */
export function rgb2hex(rgb) {
    let hexcode = '#';
    if (rgb.length > 3) {
        rgb = rgb.slice(0, 3);
    }
    rgb.forEach(c => {
        let hex = c.toString(16);
        if (hex.length < 2) {
            hex = '0' + hex;
        }
        hexcode += hex;
    });
    return hexcode;
}

/**
 * Takes an HSL array and converts it into an RGB array
 * @param {Number[]} hsl [hue, saturation, lightness] hsl color
 * @returns [red, green, blue] an array that represents a color in RGB
 */
export function hsl2rgb(hsl) {
    if (typeof hsl !== 'object') {
        throw new Error(`Expected hsl to be object, instead got: ${typeof hsl} for ${hsl}`);
    }
    if (hsl.length !== 3) {
        console.warn(`Warning! hsl2rgb expects an array with length 3 
                      [hue, saturation, lightness], instead got an array 
                      with length = ${hsl.length} for ${hsl}\n
                      Running anywas and using the first three values as 
                      hue, saturation, lightness.`);
    }
    let rgb = [];
    let h = hsl[0];
    let s = hsl[1]
    let l = hsl[2]
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let hPrime = h / 60;
    let x = c * ( 1 - Math.abs( (hPrime % 2) - 1 ) );
    if (hPrime >= 0 && hPrime <= 1) {
        rgb = [c, x, 0];
    }
    else if (hPrime > 1 && hPrime <= 2) {
        rgb = [x, c, 0];
    }
    else if (hPrime > 2 && hPrime <= 3) {
        rbg = [0, c, x];
    }
    else if (hPrime > 3 && hPrime <= 4) {
        rgb = [0, x, c];
    }
    else if (hPrime > 4 && hPrime <= 5) {
        rgb = [x, 0, c];
    }
    else if (hPrime > 5 && hPrime <= 6) {
        rgb = [c, 0, x];
    }
    let m = l - (c / 2);
    rgb[0] = Math.round(255 * (rgb[0] + m));
    rgb[1] = Math.round(255 * (rgb[1] + m));
    rgb[2] = Math.round(255 * (rgb[2] + m));
    return rgb;
}

/**
 * Checks if the contrast ratio between a given color and list of colors is acceptable.
 * @param {Number[]} rgb the color to check
 * @param {Number[][]} colors an array of [r, g, b] colors to check contrast ratio against
 * @param {Number} limit the ratio limit that is acceptable (ratio should be higher or equal) 
 * @returns 
 */
export function ratioAcceptable(rgb, colors, limit) {
    return !colors.map(c => ratio(rgb, c) >= limit).includes(false);
}

/**
 * finds hue of color
 * @param {Number[]} rgb rgb color array 
 * @returns 
 */
export function hue(rgb) {
    let [r, g, b] = rgb.map(c => c / 255); 
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let c = max - min;
    let hue;
    if (c === 0) {
        hue = 0;
    } 
    else {
        switch(max) {
        case r:
            var segment = (g - b) / c;
            var shift   = 0 / 60;       // R° / (360° / hex sides)
            if (segment < 0) {          // hue > 180, full rotation
              shift = 360 / 60;         // R° / (360° / hex sides)
            }
            hue = segment + shift;
            break;
        case g:
            var segment = (b - r) / c;
            var shift   = 120 / 60;     // G° / (360° / hex sides)
            hue = segment + shift;
            break;
        case b:
            var segment = (r - g) / c;
            var shift   = 240 / 60;     // B° / (360° / hex sides)
            hue = segment + shift;
            break;
        }
    }
    return hue * 60;
}

/**
 * Takes rgb gives saturation
 * @param {Number[]} rgb rgb color array 
 * @param {Number[]} hsl hsl color array
 */
export function sat(rgb, hsl) {
    hsl ??= [null, null, lumHSL(rgb)];
    //rgb = rgb.map(c => c / 255);
    let max = Math.max(...rgb);
    let min = Math.min(...rgb);
    let L = hsl[2];
    return L < 0.5 ? (max - min) / (max + min) : (max - min) / (Math.abs(2 - max - min));
}

/**
 * Takes an rgb color gives luminance in HSL (not WCAG luminance!).
 * @param {Number[]} rgb rgb color array
 * @return luminance in HSL (not the same as WCAG lum!)
 */
export function lumHSL(rgb) {
    rgb = rgb.map(c => c / 255);
    let max = Math.max(...rgb);
    let min = Math.min(...rgb);
    let L = (max + min) / 2;
    return L;
}

/**
 * turns rgb into hsl
 * @param {Number[]} rgb rgb color array
 * @returns hsl color array
 */
export function rgb2hsl(rgb) {
    let lum = lumHSL(rgb);
    let h = hue(rgb);
    let s = sat(rgb);
    return [h, s, lum];
}

export function text2rgba(text) {
    let color = [];
    let regex = /\d+(\.\d+)?/gi;
    for (const match of [...text.matchAll(regex)]) {
        color.push(Number(match[0]));
    }
    return color;
}

/**
 * Combines two colors. Does not currently always match color combinations of html in browsers.
 * @param {Array<Number>} rgba1 [r, g, b, a] above rgba2
 * @param {Array<Number>} rgba2 [r, g, b, a] below rgba1
 * @returns [red, green, blue, alpha] combination of the two colors given
 */
export function combineColors(rgba1, rgba2) {
    let alpha = rgba1[3] + rgba2[3] * (1 - rgba1[3]);
    let newColor = (pos) => Math.round((rgba1[pos] * rgba1[3] + rgba2[pos] * rgba2[3] * (1 - rgba1[3])) / alpha);
    let red = newColor(0);
    let green = newColor(1);
    let blue = newColor(2);

    return [red, green, blue, alpha];
}

/**
 * Combines two colors. Does not currently always match color combinations of html in browsers.
 * @param {Array<Number>} rgba1 [r, g, b, a] above rgba2
 * @param {Array<Number>} rgba2 [r, g, b, a] below rgba1
 * @returns [red, green, blue, alpha] combination of the two colors given
 */
export function combineColors2(rgba1, rgba2) {
    let alpha = 1 - (1 - rgba1[3]) * (1 - rgba2[3]);
    let newColor = (pos) => (1 - rgba1[3]) * rgba2[pos] + rgba1[pos];
    let red = newColor(0);
    let green = newColor(1);
    let blue = newColor(2);

    return [red, green, blue, alpha];
}