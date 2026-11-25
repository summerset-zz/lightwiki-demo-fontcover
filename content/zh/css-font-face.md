---
title: "@font-face"
keywords: ['@font-face', src, local, unicode-range, font-display, 网页字体]
description: 每个描述符都是在声明这个文件是什么，不是把文字变粗变斜。含 src、local()、unicode-range 与多 face 的写法。
section: dev
order: 1
updated: 2026-11-04
draft: false
---

`@font-face` 为字体文件定义一个族名，供 `font-family` 引用。它不加载字体，也不改变字体，只做登记。

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

## 描述符都是声明 {#declaration}
<!-- hint: @font-face | @font-face 为字体文件定义一个族名，供 font-family 引用。其中的描述符是声明，不是样式设置。 -->

这是最容易搞混的一点：

- `@font-face` 里的 `font-weight: 400` 意思是**这个文件就是 400**，不是把它渲染成 400；
- 想让一段文字变粗，用的是规则里的 `font-weight: 700`，浏览器再回头找哪个 face 声明自己是 700。

所以写了 `font-weight: bold` 却没变粗，通常不是 CSS 写错，而是没有声明 700 的 face，浏览器只好去合成（见下）。

## src 与 format {#src}

`src` 是候选列表，浏览器取它能用的第一个：

```css
src: url('/fonts/inter.woff2') format('woff2'),
     url('/fonts/inter.woff') format('woff');
```

- **顺序**：新格式放前面，老的兜底；
- `format()` 让浏览器跳过不支持的格式，不用白下载；
- 现代浏览器都支持 `woff2`，`woff` 基本只用于很老的浏览器，`ttf` / `otf` 直接给网页用体积偏大。

## local() 的用处与坑 {#local}

```css
src: local('Inter'), url('/fonts/inter.woff2') format('woff2');
```

`local()` 让浏览器先试本机已装的字体，装了就省一次下载。

坑在名字：`local()` 的参数既可以是**全名**也可以是 **PostScript 名**，不同浏览器对哪一个更可靠并不一致；而本机装的那一版可能比你要的版本旧，甚至是别的字体冒用了同名。**要求渲染一致的地方别写 `local()`**，直接走 `url()`。

## 一个家族多个 face {#multi-face}

同一族名下声明多条，靠 `font-weight` / `font-style` 区分：

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-700.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-italic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
}
```

之后 `font-family: Inter; font-weight: 700` 就命中第二条。

变量字体只需要一条，把区间写进描述符：

```css
@font-face {
  font-family: 'InterVariable';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}
```

## unicode-range：子集化 {#unicode-range}

```css
@font-face {
  font-family: 'Noto Sans SC';
  src: url('/fonts/noto-sc-000.woff2') format('woff2');
  unicode-range: U+4E00-9FFF, U+3000-303F;
}
```

浏览器只在这个范围内遇到字符时，才去下载这个文件。中文字体动辄几 MB，按 `unicode-range` 切成几十个分片，页面就只下载用到的那几片。代价是分片数量多、配置麻烦。

它常被和“子集化”混为一谈，其实两者改的不是一回事：一个改文件内容，一个改下载量。区别与各自的代价见[按需加载与子集化](/)font-subsetting)。

## font-display（先提一句）{#display}

`block` / `swap` / `fallback` / `optional` 决定字体还没到的那几百毫秒显示什么。它是文字跳动（布局位移）的主要原因之一，展开在[字体加载](/)css-font-loading)里讲。

## 本站的立场 {#this-site}

本站**不托管字体文件**：服务端只存这个字体的指纹与元数据，从不存字节。所以这里没有可以直接使用的 `src` 地址，上面的 `src` 都是占位路径。

检查器里能“临时载入”库字体，是把字节**当场**从 CDN 取到浏览器内存里注册，没有落到本站的存储上。

## 延伸阅读

- MDN：`@font-face`（每个描述符一页）
- CSS Fonts 规范：`@font-face` 规则与描述符定义
