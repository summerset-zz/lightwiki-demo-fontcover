---
title: 空白与换行
keywords: white-space, overflow-wrap, word-break, text-wrap, 换行, 换行符, 软回车, 硬回车, 断词, 省略号, ellipsis, hyphens, 制表符, tab-size, 空白, 空格
description: 六个 white-space 值各管什么，两种断词方式差在哪，以及三个能直接抄的组合。
section: dev
order: 4
updated: 2026-11-02
draft: false
---

文本换行是三个属性合起来决定的：`white-space` 管空白和换行符怎么处理，`overflow-wrap` 与 `word-break` 管一行排不下时从哪里断。它们经常被混为一谈，因为它们的效果在简单例子里看起来一样。

## white-space 的六个值 {#white-space}
<!-- hint: white-space | white-space 同时控制两件事：空白如何合并，以及是否允许自动换行。 -->

| 值 | 连续空格 | 换行符 | 自动换行 |
| --- | --- | --- | --- |
| `normal` | 合并成一个 | 当空格 | 允许 |
| `nowrap` | 合并 | 当空格 | **禁止** |
| `pre` | 保留 | 保留 | **禁止** |
| `pre-wrap` | 保留 | 保留 | 允许 |
| `pre-line` | 合并 | 保留 | 允许 |
| `break-spaces` | 保留（含末尾空格） | 保留 | 允许，且**空格之后也能换** |

记忆方式：`pre` 系列保留空白（像 `<pre>` 标签），带 `wrap` 的允许换行，`pre-line` 只保留换行不留空格。

`pre-wrap` 与 `break-spaces` 的差别只在**行尾空格**：前者把行尾空格悬挂到行外，后者把它们当成可断字符。做聊天记录、代码对比时这个差别看得见。

把六个值挨个点一遍，注意两件事：`nowrap` 会一路冲出右边那条虚线，`pre` 系列会把源码里的空格与换行原样保留。

{{InteractiveExample("CSS Demo: white-space")}}

```css interactive-example-choice
white-space: normal;
```

```css interactive-example-choice
white-space: nowrap;
```

```css interactive-example-choice
white-space: pre;
```

```css interactive-example-choice
white-space: pre-wrap;
```

```css interactive-example-choice
white-space: pre-line;
```

```css interactive-example-choice
white-space: break-spaces;
```

```html interactive-example
<div id="example-element">
  One   two   three
  four five six seven eight nine ten eleven twelve
</div>
```

```css interactive-example
#example-element {
  max-width: 220px;
  border-right: 1px dashed currentColor;
}
```

## 软回车与硬回车 {#breaks}

同样是“换了一行”，HTML 里有两种做法，代价完全不同：

| 做法 | 是什么 | 吃到哪些间距 |
| --- | --- | --- |
| `<p>` 换段（硬回车） | 两个独立的块 | 段落自己的 `margin` + `padding`（段间距） |
| `<br>`（软回车） | **同一个块内**换行 | 只有 `line-height`（行距） |

所以在一个块里连打两个 `<br>` 只会多出一个行盒，高度由 `line-height` 决定；想要“段间空一行”，得用独立的 `<p>`，或者给块加 `margin`。这也是“用回车凑出来的间距”在改行高之后整体变形的原因：它本来就不是段间距。

源码里的换行符 `\n` 和 `<br>` 也不是一回事：`\n` 是**空白**，`white-space: normal` 下被合并成一个空格；要让它真的换行，前提是上面那张表里的 `pre` 系列。

Word 里是同一件事，只是标记不同：

- 灰色的 `↵`（软回车，Shift+Enter）：只换行，段落格式照旧；
- `¶`（硬回车）：**真的另起一段**，段前段后间距、段落样式全都生效。

回到“Unicode 里有这个字符吗”：Word 的 `↵` 与 `¶` 是**格式标记**，文档里并不存这两个字符。Unicode 里对应的分隔符确实是两个真有码位的字符：`U+2028` LINE SEPARATOR 与 `U+2029` PARAGRAPH SEPARATOR；而 `↵`（`U+21B5`）、`¶`（`U+00B6`）本身也是字符，只是在这里被借来当标记，不是分隔符本身。

示例里只有第一段是 `#example-element`：把它的 `margin` 改掉，段间距就没了；再调 `line-height`，你会看到 `<br>` 两行之间的空隙只受行高影响，与段间距互不相干。

{{InteractiveExample("CSS Demo: soft and hard breaks")}}

```css interactive-example-choice
margin: 0 0 1.25em;
```

```css interactive-example-choice
margin: 0;
```

```css interactive-example-choice
margin: 0;
line-height: 2.4;
```

```html interactive-example
<p id="example-element">第一段。<br>这一行用软回车，只隔一个行距。</p>
<p>第二段（参考）：它和上面那一段之间的空白，就来自第一段的 margin。</p>
```

```css interactive-example
#example-element {
  max-width: 22em;
}
```

## overflow-wrap：长单词怎么办 {#overflow-wrap}

默认情况下，一个过长的单词（URL、哈希）会**溢出**容器，而不是断行，因为西文只在空格与连字符处断行。

| 值 | 行为 |
| --- | --- |
| `normal` | 只在正常断点断，长单词溢出 |
| `break-word` | 实在放不下时才在任意位置断（不影响最小内容宽度计算） |
| `anywhere` | 任意位置可断，**并且**参与 `min-content` 计算（容器可以被撑到最窄） |

`word-wrap` 是 `overflow-wrap` 的旧名，两者等价；新代码写 `overflow-wrap`。

把宽度压到 200px 左右，`normal` 下那串网址会直接冲出虚线，`anywhere` 还会把容器撑到更窄。

⚠️ 这一串里**不能带连字符**：`-` 本身就是合法断点，带连字符的网址在 `normal` 下也会正常换行，看起来就像属性没生效（第一版就是这么写坏的）。

{{InteractiveExample("CSS Demo: overflow-wrap")}}

```css interactive-example-choice
overflow-wrap: normal;
```

```css interactive-example-choice
overflow-wrap: break-word;
```

```css interactive-example-choice
overflow-wrap: anywhere;
```

```html interactive-example
<div id="example-element">
  https://example.com/abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnop
</div>
```

```css interactive-example
#example-element {
  max-width: 200px;
  border-right: 1px dashed currentColor;
}
```

## word-break：更激进的断法 {#word-break}

| 值 | 行为 |
| --- | --- |
| `normal` | 按语言规则断（中日韩可以在字间断，西文按词） |
| `break-all` | 任意两个字符之间都能断，**包括西文单词内部** |
| `keep-all` | 中日韩文本不在字间断（西文行为不变） |

`break-all` 的典型用途是一列固定宽度的数字或编码，代价是英文单词会被拦腰砍断。`break-word` 作为 `word-break` 的值已经废弃，别再用。

中文本身**不需要** `break-all`：CJK 字符默认就可以在任意字之间换行，这是语言规则的一部分。

`keep-all` 的效果要在中英混排里才看得出来：中文不再断开，那一长串英文反而会把容器顶宽。

{{InteractiveExample("CSS Demo: word-break")}}

```css interactive-example-choice
word-break: normal;
```

```css interactive-example-choice
word-break: break-all;
```

```css interactive-example-choice
word-break: keep-all;
```

```html interactive-example
<div id="example-element">
  中文混排 Supercalifragilisticexpialidocious 结尾
</div>
```

```css interactive-example
#example-element {
  max-width: 200px;
  border-right: 1px dashed currentColor;
}
```

## hyphens：连字符断词 {#hyphens}

- `none`：不断；
- `manual`：只在源码里写了软连字符 `&shy;` 的地方断；
- `auto`：由浏览器按**词典**断，需要元素上有正确的 `lang` 属性。

`hyphens: auto` 对中文没有意义（中文不用连字符），对英文排版有用，但要确认目标浏览器与语言包。

## text-wrap：让短行更好看 {#text-wrap}

| 值 | 用途 |
| --- | --- |
| `wrap` | 默认 |
| `nowrap` | 与 `white-space: nowrap` 类似，但只管换行不管空白 |
| `balance` | 让一段短文本的**每行长度尽量接近**，适合标题 |
| `pretty` | 尽量避免最后一行只剩一个词（孤字） |

`balance` 只适合几行的短文本（标题、卡片标题）；用在长段落上浏览器会直接忽略，因为它有行数上限。

`balance` 的效果需要两行以上才看得见：把它关回 `wrap`，最后一行会只剩一两个词。

{{InteractiveExample("CSS Demo: text-wrap")}}

```css interactive-example-choice
text-wrap: wrap;
```

```css interactive-example-choice
text-wrap: balance;
```

```css interactive-example-choice
text-wrap: pretty;
```

```html interactive-example
<div id="example-element">
  A short headline that is meant to break into two lines of similar length
</div>
```

```css interactive-example
#example-element {
  max-width: 260px;
  font-size: 20px;
  border-right: 1px dashed currentColor;
}
```

## 制表符与空格 {#tabs}

Tab（`\t`）默认**只是一个空白**：`white-space: normal` 下它和空格一样被合并掉。要让它显示出来，需要使用上面那组值中的 `pre`、`pre-wrap` 或 `break-spaces`。

显示出来之后，宽度由 `tab-size` 决定：

```css
pre {
  tab-size: 4;   /* 数字 = 几个空格宽；也可以给长度，如 2em */
}
```

规范的初始值是 `8`。但它按**当前字体的空格宽度**计算，换一款字体 Tab 的实际宽度就会变。显式写出数值更可靠。

这里要说清一件事：CSS **没有** Word 那种“制表位”（左 / 居中 / 右 / 小数点对齐，再加前导符）。要做那种对齐，得换工具：

| 想要的效果 | 在 CSS 里怎么做 |
| --- | --- |
| 多列对齐 | `<table>`，或 `display: grid` 的 `grid-template-columns` |
| 数字按位对齐 | `font-variant-numeric: tabular-nums` + 右对齐 |
| 小数点对齐 | 没有对应属性；把整数与小数拆成两列，分别右对齐 / 左对齐 |
| 前导符（用点线补到齐） | 没有对应属性；用 `flex` 撑开距离 + `border-bottom: 1px dotted` 画线 |

两件常被忽略的事：

- **连续空格**：`normal` 下十个空格也只占一个；要保留得用 `pre-wrap`（评论、备注场景见下面的组合）；
- **等宽数字**：默认的比例数字里 `1` 比 `8` 窄，纵向永远对不齐；`tabular-nums`（或字体自带的 `tnum` 特性）让每个数字同宽，表格里的金额、版本号都该开。

## 三个能直接抄的组合 {#recipe}

单行省略：

```css
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

长的 URL 或哈希不撑破容器：

```css
.break-anywhere {
  overflow-wrap: anywhere;
}
```

保留用户输入的换行与空格（评论、备注）：

```css
.user-text {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
```

三个组合摆在一起看：第一项把文字压成一行，第二项让长串自己折行，第三项把源码里的换行和空格也留住。

{{InteractiveExample("CSS Demo: whitespace recipes")}}

```css interactive-example-choice
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
```

```css interactive-example-choice
overflow-wrap: anywhere;
```

```css interactive-example-choice
white-space: pre-wrap;
overflow-wrap: anywhere;
```

```html interactive-example
<div id="example-element">第一行    中间有四个空格
  第二行由源码换行符产生
  https://example.com/abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnop</div>
```

```css interactive-example
#example-element {
  max-width: 220px;
  border-right: 1px dashed currentColor;
}
```

## 延伸阅读

- MDN：`white-space` / `overflow-wrap` / `word-break` / `hyphens` / `text-wrap`
- CSS Text 规范：white space processing 与 line breaking
