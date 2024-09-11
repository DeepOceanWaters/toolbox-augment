/**
 * a.includes(b) but case insensitive.
 * @param {String} a 
 * @param {String} b
 * @return {Boolean} 
 */
export default function includesCaseInsensitive(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return a.includes(b);
}