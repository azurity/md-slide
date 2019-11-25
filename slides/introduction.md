---
title: MD-slide introduction
author: '@azurity'
config:
    loop: false
highlight-theme: 'https://cdn.bootcss.com/highlight.js/9.15.10/styles/solarized-dark.min.css'
---
<slide/>

# MD Slide

> a server for slides which are generated from markdown

[:fab-github: GitHub](https://github.com/azurity/md-slide){.button .ghost}

<slide/>

# based on

- [**WebSlides**](https://webslides.tv/)
- [**markdown-it**](https://github.com/markdown-it/markdown-it)
- [**highlight.js**](https://highlightjs.org/)
{.flexblock .specs .size-50}

<slide/>

# and server based on

- [**Express**](http://www.expressjs.com.cn/)
- [**Chokidar**](https://github.com/paulmillr/chokidar)
- [**EJS**](https://ejs.co/)
- [**JS-YAML**](https://github.com/nodeca/js-yaml)
{.flexblock .specs .size-50}

<slide/>

# and other libs that depend on or can be used

- [**md-it-meta**](https://www.npmjs.com/package/md-it-meta)
- [**markdown-it-attrs**](https://www.npmjs.com/package/markdown-it-attrs)
- [**markdown-it-container**](https://www.npmjs.com/package/markdown-it-container)
- [**markdown-it-fontawesome**](https://www.npmjs.com/package/markdown-it-fontawesome)
- [**Animate.css**](https://www.npmjs.com/package/animate.css)
- [**WebSlidesAnimation**](https://www.npmjs.com/package/webslides-animation)
- [**markdown-it-katex**](https://www.npmjs.com/package/markdown-it-katex)
- [**css-doodle**](https://css-doodle.com/)
- [**ECharts**](http://echarts.apache.org/)
- [**mermaid**](http://mermaid-js.github.io/mermaid/)
- and more if you think I should support!
{.flexblock .metrics}

<slide/>

# syntax supported

<slide/>

# basic markdown syntax

see more at [CommonMark Spec](http://spec.commonmark.org/) *supported through markdown-it*

```markdown
# basic Markdown syntax

see more at [CommonMark Spec](http://spec.commonmark.org/) *supported through markdown-it*
```

<slide/>

# slide syntax

```markdown
<slide attr.../>
```
you can use `class`, `wrap`, `align` attributes

you will get:
```html
<section class="align-attr your-classes-from-class-attr">
    <div class="wrap your-classes-from-wrap-attr">
        ...
    </div>
</section>
```

<slide class="bg-blue" align="left" wrap="size-40 frame"/>

**an example:**
```markdown
<slide class="bg-blue" align="left" wrap="size-40 frame"/>
```

<slide/>

# background syntax

```markdown
<slide/>
::{any background attributes here}
```

attributes syntax sere so: [attributes syntax](#slide=15)

<slide/>
::{style=background-image:url('https://source.unsplash.com/UJbHNoVPZW0/')}

**an example:**
```markdown
<slide/>
::{style=background-image:url('https://source.unsplash.com/UJbHNoVPZW0/')}
```

<slide/>

### more about slides/background/layout syntax, see so: [WebSlides CSS Syntax](https://webslides.tv/demos/classes#slide=2)

<slide/>

# container syntax

:::div{style=width:100px;height:100px .bg-red}
:::

```markdown
:::div{style=width:100px;height:100px .bg-red}
:::
```

based on markdown-it-container, see so: [markdown-it-container](https://www.npmjs.com/package/markdown-it-container)

<slide/>

# alias

some useful class has an shortcut. such as `:::grid` means `:::div{.grid}`

you can add more alias by editing `container-alias.yaml`

<slide/>

# note syntax

note will be used in speaker mode

```markdown
:::note
your note here.
:::
```

:::note
your note here.
:::

about speaker-mode, see so: [speaker mode](#slide=24)

<slide/>

# attributes syntax

a line {#line .bg-trans-light}

```markdown
{#line .bg-trans-light}
```

based on markdown-it-attrs, see so: [markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs)

<slide/>

# meta syntax

```yaml
---
title: MD-slide introduction
author: '@azurity'
config:
    loop: false
highlight-theme: 'https://cdn.bootcss.com/highlight.js/9.15.10/styles/solarized-dark.min.css'
---
```

- `title` & `author` will be shown in the list page.
- `config` will be used as WebSlides config.
- `highlight-theme` will be used as highlight css theme.

<slide/>

# font-awesome syntax

This is based on markdown-it-fontawesome & fonr-awesome v5 :fab-font-awesome:

```markdown
:fab-font-awesome:
```

see so: [markdown-it-fontawesome](https://www.npmjs.com/package/markdown-it-fontawesome) & [Font Awesome](https://fontawesome.com/)

<slide/>
::{data-step-count=1}

# animation syntax

combine Animate.css & WebSlidesAnimation

:fas-info:{.bounce .infinite .animated}

```markdown
::{data-step-count=...}

something {.bounce .infinite .animated}

something with step {.animate-step .bounce data-step=1}
```

see so: [Animate.css](https://www.npmjs.com/package/animate.css){.animate-step .fadeIn data-step=1} & [WebSlidesAnimation](https://www.npmjs.com/package/webslides-animation){.animate-step .fadeIn data-step=1}


<slide/>

# TeX syntax

**now can only available in block mode!**

$$e^{-i\pi} + 1 = 0$$
$$E = mc^2$$

```tex
$$e^{-i\pi} + 1 = 0$$
$$E = mc^2$$
```

based on markdown-it-katex & KaTeX, see so: [markdown-it-katex](https://www.npmjs.com/package/markdown-it-katex)

<slide/>

# render DSL syntax

you can use this syntax to render DSL, such as: [css-doodle](https://css-doodle.com/) & [ECharts](http://echarts.apache.org/) & [mermaid](http://mermaid-js.github.io/mermaid/)

use like:
````markdown
```render(DSL-name)
DSL code
```
````

<slide/>

**css-doodle example:**
::::grid
:::column
```render(css-doodle)
:doodle {
    @grid: 10 / 16em;
}
background-color: tomato;
transform: scale(@rand(.2, .9));
```
:::
:::column
````markdown
```render(css-doodle)
:doodle {
    @grid: 10 / 16em;
}
background-color: tomato;
transform: scale(@rand(.2, .9));
```
````
:::
::::

<slide/>

**echarts example:**
:::::grid
::::column
:::div{style=display:inline-block;width:400px;height:400px}
```render(echarts)
{
    "title": {
        "text": "ECharts 入门示例"
    },
    "legend": { "data":["销量"] },
    "xAxis": {
        "data": ["衬衫","羊毛衫","雪纺衫"]
    }, "yAxis": {},
    "series": [{
        "name": "销量",
        "type": "bar",
        "data": [5, 20, 36]
    }]
}
```
:::
::::
::::column
````markdown
:::div{style=display:inline-block;width:400px;height:400px}
```render(echarts)
{
    "title": {
        "text": "ECharts 入门示例"
    },
    "legend": { "data":["销量"] },
    "xAxis": {
        "data": ["衬衫","羊毛衫","雪纺衫"]
    }, "yAxis": {},
    "series": [{
        "name": "销量",
        "type": "bar",
        "data": [5, 20, 36]
    }]
}
```
:::
````
::::
:::::

<slide/>

**mermaid example:**

::::grid
:::column
```render(mermaid)
sequenceDiagram
    Alice ->> Bob: Hello Bob, how are you?
    Bob-->>John: How about you John?
    Bob--x Alice: I am good thanks!
    Bob-x John: I am good thanks!
    Bob-->Alice: Checking with John...
    Alice->John: Yes... John, how are you?
```
:::
:::column
````markdown
```render(mermaid)
sequenceDiagram
    Alice ->> Bob: Hello Bob, how are you?
    Bob-->>John: How about you John?
    Bob--x Alice: I am good thanks!
    Bob-x John: I am good thanks!
    Bob-->Alice: Checking with John...
    Alice->John: Yes... John, how are you?
```
````
:::
::::

<slide/>

# speaker mode

Speaker mode can be used easily by `?mode=speaker`

[open speaker mode](/slide/introduction?mode=speaker){.button}

<slide/>

# list page

This root page ([`/`](/)) is a list for all slides on server.

<slide/>

# file system

- all module's static folders will be provided at `/:module-name`
- all slides should saved in `slides` and will be provided at `/slide/:slide-name/`
- if you need some static source, you can use a folder, that have a `index.md` and a `public` folder in it.
- and the local static files will be provided at `/slide/:slide-name/*`
- if you need to use global static source, save it in `public`, and will be provided at `/public/*`

folder mode see so: [folder example](/slide/folder-example)

<slide/>

If you need one more function, please create an issue on github.

[:fab-github: issue](https://github.com/azurity/md-slide/issues){.button .bg-black}

maybe you want to see again?

[:fas-arrow-up:](#slide=1){.button .ghost}
