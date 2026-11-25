---
title: 等宽字体
description: 每个字符占一样宽，代码与表格因此能对齐；也解释了等宽数字为什么是另一回事。
keywords: 等宽, 等宽字体, monospace, monospaced, 代码字体, 表格数字, tnum
section: design
order: 9
updated: 2026-11-07
sourceSite: zh.wikipedia.org
sourceTitle: 等宽字体
sourceRevid: 88097231
sourceUrl: https://zh.wikipedia.org/w/index.php?oldid=88097231
sourceLicense: Creative Commons Attribution-Share Alike 4.0
sourceLicenseUrl: https://creativecommons.org/licenses/by-sa/4.0/deed.zh
sourceRetrieved: 2026-11-07
sourceChanges: 删除了全部图片、公式、引用角标、信息框、表格标题与“参见 / 外部链接”类收尾小节；正文文字未改动。
hintTitle: 等宽字体
hint: 每个字符占一样宽，代码与表格因此能对齐。和“数字等宽”（tabular figures）不是一回事。
---

**等宽字体**（英语：Monospaced Font）是指字符宽度相同的电脑字体。与比例字体相反，比例字体的字符宽度不同。

## 概要 {#概要}

传统西文印刷中，比例字体有利阅读，但受打字机及早期电脑画面显示等技术所限，无法调整字母宽度比例，因此将字符都制成等宽。在等宽字体中，字母“i”、“j”两边空白多，字母“w”、“m”的笔画紧凑。

但是随着图形用户界面普及和电脑技术提高，比例字体的局限得到突破，因此现在排版上显得比较自然的比例字体的使用已经相当普及。

东亚文字中，方块字基本视为等宽，如各地区的汉字、全型日语假名、韩语谚文音节等都是等宽，但有些中／日文字体将西文字符制成比例宽度，造成一体两式。

东亚标点有时会随标准规定、压缩处理而改变宽度；CSS有项font-variant-east-asian设置可以自定义压缩与否。

旧版中文Windows操作系统默认字体新细明体（繁体）／中易宋体（简体）东西文皆等宽；Windows Vista改为微软正黑体（繁体）／微软雅黑（简体），全型字符等宽；半型西文字符比例宽度。

## 应用 {#應用}

在互联网里，网友和艺术家常用等宽字体创作ASCII艺术作品。若使用比例字体显示这些作品，它们往往会因字体宽度不一而无法正确显示图样。

| 比例字体 | 等宽字体 |
| --- | --- |
| ┌─┐ ┌┬┐<br>│  │ ├┼┤<br>└─┘ └┴┘ | ┌─┐ ┌┬┐<br>│  │ ├┼┤<br>└─┘ └┴┘ |

代码编辑器、命令行／虚拟终端等纯文字界面也会用等宽字体以便对齐，有利阅读代码文字，尤其在显示比例过窄、小字体界面上不易分辨的字符（如`Iilj1`）与标点。

网页浏览器在遇到`<pre>`、`<code>`等HTML标记时，通常默认使用等宽字体显示其内容。

## 等宽字体举例 {#等宽字体举例}

仅为举例，操作系统间可能有异。

### 西文字体 {#西文字体}

-   Courier（PostScript核心字体）
    -   Courier New
    -   Nimbus Mono L
    -   GNU FreeMono
    -   Liberation Mono，其大小一致，“[度量兼容](/)fonts-families-faces#字体指标)（metrically compatible）”
-   DejaVu Sans Mono
    -   Menlo
    -   文泉驿等宽正黑

以下列出通常只在某些系统找到的字体。

-   GNU/Linux，Solaris
    -   Luxi Mono
    -   GNU Unifont
-   macOS
    -   Monaco
-   Windows
    -   Fixedsys
    -   Consolas

### 西文等宽的中日韩字体 {#西文等宽的中日韩字体}

西文等宽的中日韩字体不少，如中易宋体、中易黑体、さざなみ（Sazanami）、IPA字体、细明体、Hei、Kai、Osaka－等幅和MS明朝；一些西文等宽的中日韩字体有比例半型版，如新细明体（PMingLiU），名字前有`P`。
