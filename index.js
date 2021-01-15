'use strict';

const [site, error] = [{
    "demo_output": "https://cdn.jsdelivr.net/gh/wzpan/hexo-generator-search@master/demo_output/search.json"
    }, `usage:\n\
    ?siteSearch=<site>&q=<keyword>\n\
    required: q`]
let data = {}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function get(searchSite) {
    await fetch(searchSite)
        .then(res => res.json().then(json => data[searchSite] = json))
}

async function search(searchTerm, searchSite) {
    searchTerm = JSON.parse(`"${searchTerm.trim().toLowerCase()}"`)
    if (!data[searchSite]) await get(searchSite)
    let result = { "items": [] }
    data[searchSite].forEach(({ title, content, url }) => {
        const push = snippet => result.items.push({
            "title": title || url,
            "link": url,
            "snippet": snippet || ""
        })
        if (content && content.toLowerCase().includes(searchTerm)) push(content.replace(/<[^>]+>/g, "").substring((content.toLowerCase().indexOf(searchTerm) - 20), (content.toLowerCase().indexOf(searchTerm) + 119)))
        else if (title && title.toLowerCase().includes(searchTerm)) push(content.replace(/<[^>]+>/g, "").substring(0, 139))
    })
    return JSON.stringify(result, null, 2)
}

async function handleRequest(request) {
    const { searchParams } = new URL(request.url)
    let [searchTerm, searchSite] = [searchParams.get('q'), searchParams.get('siteSearch') === null ? Object.values(site)[0] : site[searchParams.get('siteSearch')]]
    return new Response(searchTerm === null ? error : await search(searchTerm, searchSite), {
        status: 200,
        headers: new Headers({
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET,POST,PUT,PATCH,TRACE,DELETE,HEAD,OPTIONS',
            'access-control-max-age': '1728000',
        }),
    })
}