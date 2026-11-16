---
title: 字体加载
keywords: font-display, preload, CLS, 布局位移, 字体加载, FOUT, FOIT
description: font-display 的五个值各自在什么时间点显示什么，preload 为什么必须带 crossorigin，以及怎么让文字不跳。
section: dev
order: 5
updated: 2026-11-02
draft: false
---

网页字体是**独立资源**：HTML 先到，字体后到。中间那段空档里显示什么，由 `font-display` 决定；字体到了之后文字会不会跳，由两套字体的度量差决定。

## 两种经典现象 {#foit-fout}

- **FOIT**（flash of invisible text）：字体没到之前文字不可见，到了才出现。看起来像页面空白了一下。
- **FOUT**（flash of unstyled text）：先用回退字体显示，字体到了再替换。看起来像文字跳了一下。

`font-display` 就是在两者之间选，或者选中间态。

## font-display 的五个值 {#display}
<!-- hint: font-display | font-display 决定字体加载完成前显示什么，是文字跳动（布局位移）的主要原因之一。 -->

| 值 | 不可见期 | 替换期 |
| --- | --- | --- |
| `auto` | 由浏览器决定（通常接近 `block`） | 同所选行为 |
| `block` | 较长（规范建议约 3 秒） | 没有，过了不可见期一直使用回退字体 |
| `swap` | 极短（约 100 毫秒） | 无限，字体随时到了随时换 |
| `fallback` | 极短（约 100 毫秒） | 有限（约 3 秒），之后不再换 |
| `optional` | 极短 | 没有；这次没赶上就这次不用（缓存里有则直接用） |

具体毫秒数是规范给的**建议值**，浏览器可以不同。

实践建议：正文用 `swap`（宁可先看到回退字体，也别看不到字）；图标字体不要用 `swap`（回退时会出现完全错误的字形，比如单词被拆成几个图标）；品牌标题可以用 `optional`（宁可这次不用，也不要跳）。

## preload：别让浏览器排队等 {#preload}

字体通常是在 CSS 解析完之后才被发现，已经晚了一步。首屏真正用到的字体可以提前声明：

```html
<link rel="preload" href="/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin />
```

三件事别漏：

- `as="font"`：告诉浏览器资源类型，否则优先级不对；
- `type`：不支持的格式会被直接跳过，不用白下；
- **`crossorigin`**：字体请求是 CORS 请求，缺了它浏览器会**再下一次**（预载的那份用不上）。

只 preload 首屏真正会用的那一两个文件；把所有字重都 preload 等于抢带宽。

## 文字为什么会跳 {#cls}

回退字体与网页字体的度量不同：x 高度、字宽、行距都可能不一样。字体一换，一行文字可能从两行变成三行，下面的内容整体位移。这是 CLS 最常见的来源之一。

三种缓解手段：

1. **让回退字体更像**：`size-adjust`、`ascent-override`、`descent-override`、`line-gap-override` 可以调整一个 `@font-face` 的度量，让回退与目标占的高度一致；
2. **用 `font-display: optional`**：没赶上就不换，不跳但可能这次看不到目标字体；
3. **接受一次替换，但把容器高度固定**：给标题区一个 `min-height`，至少不让页面整体位移。

## 用脚本知道字体到没到 {#script}

```js
await document.fonts.load('16px Inter');   // 主动加载某个字体
document.fonts.check('16px Inter');        // 同步检查是否可用
await document.fonts.ready;                // 等所有已声明的字体加载完
```

本站的检查器就是这么做的：自己 `fetch` 字节、`new FontFace(...).load()`、再 `document.fonts.add()`。这样同一份字节还能用于测量，而 `FontFace(url)` 拿不到字节。

换字体时记得把旧的删掉（`document.fonts.delete(oldFace)`），否则同名字体在 `document.fonts` 里越堆越多，浏览器会挑其中任意一个来用。

## 缓存 {#cache}

字体文件一般不会变，文件名带上内容哈希（`inter-400.9f2c1a.woff2`），再配 `Cache-Control: public, max-age=31536000, immutable`，第二次访问就不用再请求。

反过来，如果文件名固定（`inter.woff2`），升级字体时要靠 `?v=` 之类的手段破缓存，很容易忘。

## 延伸阅读

- CSS Fonts 规范：`font-display` 的时间段定义
- MDN：`font-display`、`FontFace`、`document.fonts`
- web.dev：字体最佳实践（preload 与 CLS）
