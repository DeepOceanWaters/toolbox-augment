/**
 * sitemap: page[]
 * interface page: {
 *      name: string,
 *      url: string
 * }]
 */
/**
 * 
 * @param {*} text space delineates name/url [name, url]; newline delineates a new name/url combo
 */
export function text2sitemap(names, urls) {
    let sitemap = [];
    let listOfNames = names.split('\n');
    let listOfURLs = urls.split('\n');
    for (let i = 0; i < listOfNames.length; i++) {
        let page = text2page(listOfNames[i], listOfURLs[i]);
        sitemap.push(page);
    }
    return sitemap;
}

function text2page(name, url) {
    return {name: name, url: url};
}