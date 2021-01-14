# workers-hexo-search

Multi-site Hexo search script built with Cloudflare Workers.

使用 Cloudflare Workers 构建的多站点 Hexo 搜索脚本。

## Deploy / 部署

- A: Copy the [index.js](https://github.com/kwaa/workers-hexo-search/blob/master/index.js) in this repository to the Cloudflare Worker quick editor, and click "Save and Deploy"

    复制本仓库中的 [index.js](https://github.com/kwaa/workers-hexo-search/blob/master/index.js) 到 Cloudflare Worker 快速编辑器，点击 "保存并部署"

- B: Use the "Deploy with Workers" button below

    使用下面的 "Deploy with Workers" 按钮

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/kwaa/workers-hexo-search)

## Configuration / 配置

Configure the site and error messages in ```index.js```:

在 ```index.js``` 中配置站点和错误信息：

```javascript
const [site, error] = [{
    "example.com": "https://example.com/search.json",
    "https://example.com": "https://example.com/search.json",
    }, `usage:\n\
    ?siteSearch=<site>&q=<keyword>\n\
    required: q`]
```

## Example / 用例

There are two ways to use as a reference:

有两种使用方式作为参考：

> Press ENTER to search / 回车搜索

```html
<form onkeydown="if (event.keyCode == 13) return false">
  <input type="text" id="input" name="q">
</form>
<div id="result"></div>
<script>
  document.getElementById('input').addEventListener('input', () => {
    document.getElementById('result').innerHTML = ''
    let keyword = document.getElementById('input').value.trim().toLowerCase();
    if (keyword.length > 0) fetch(`https://${workers}/?siteSearch=${site}&q=${keyword}`)
      .then(res => res.json().then(json => json.items.forEach(({ title, link, snippet }) =>
        document.getElementById('result').insertAdjacentHTML('beforeend', `
          <div>
            <a href="${link}">${title}</a>
            <span>${snippet}</span>
          </div>
        `)
      )));
  })
</script>
```

> Instant search / 即时搜索

```html
<form onsubmit="return searchAPI(this.searchTerm.value)">
  <input type="text" id="searchTerm" name="q">
</form>
<div id="api-result"></div>
<script>
  function searchAPI(searchTerm) {
    fetch(`https://${workers}/?siteSearch=${site}&q=${searchTerm}`)
      .then(res => res.json().then(json => json.items.forEach(({title, link, snippet}) =>
        document.getElementById('api-result').insertAdjacentHTML('beforeend', `
          <div>
            <a href="${link}">${title}</a>
            <span>${snippet}</span>
          </div>
        `)
      )));
    return false;
  }
</script>
```

## License / 许可证

This work is distributed under the WTFPL licence. See the [COPYING](https://github.com/kwaa/workers-hexo-search/blob/master/COPYING) file for more details.

这个项目是根据 WTFPL 协议分发的。有关更多详细信息，请参见 [COPYING](https://github.com/kwaa/workers-hexo-search/blob/master/COPYING) 文件。