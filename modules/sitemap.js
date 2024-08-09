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
export function text2sitemap(text) {
    let sitemap = [];
    let uprocessedPages = text.split('\n');
    for (let unprocessedPageText of uprocessedPages) {
        let page = {};
        [page.name, page.url] = unprocessedPageText.split(',');
        sitemap.push(page);
    }
    return sitemap;
}