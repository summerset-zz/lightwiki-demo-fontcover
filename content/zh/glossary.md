---
title: 术语表
keywords: 术语, 词汇, 中英对照, glossary, terminology, 名词
description: 字体、Unicode 与 CSS 里反复出现的词，一句话解释，并指到讲它的那一篇。
section: basics
order: 0
updated: 2026-11-02
draft: false
---

排印是个老行业，术语又多又混：同一件事，设计师叫行距、前端叫行高、字体文件里叫 `lineGap`。这一页把站内文章会用到的词集中列一遍。

中英对照是为了**搜索**：你看到英文原词，才查得到规范原文。表格最后一栏是一句话，真要展开就看它指向的文章。

## 字体与字款 {#type}

| 中文 | English | 一句话 |
| --- | --- | --- |
| 字体（口语） | font | 有时指一个字款，有时指整个家族，看上下文 |
| 字体家族 | font family | 同一设计、不同字重与斜体的一组字款，比如“Inter” |
| 字款 | font face | 家族里确定的那一个：Inter Bold、Inter Italic。**通常一个文件就是一个字款** |
| 字重 | weight | 粗细等级，数值 100–900（400 常叫 Regular，700 常叫 Bold） |
| 字宽 | width / stretch | 同一设计的“窄版 / 宽版”，如 Condensed |
| 斜体 | italic | 单独画过的倾斜字形 |
| 伪斜体 | oblique | 把正体强行倾斜出来，没有单独设计字形 |
| 变量字体 | variable font | 一个文件里含连续的轴，能出无数个字重与字宽 |
| 光学尺寸 | optical size | 同一设计为不同字号各画一套：小字号更粗、字距更松（见 [光学尺寸轴](/)variable-fonts-design#opsz)）|
| 静态字体 | static font | 一个字重一个文件（传统做法） |

这几个词为什么必须分清，见 [字体、家族与字款](/)fonts-families-faces)。

## 字形与轮廓 {#glyph}

| 中文 | English | 一句话 |
| --- | --- | --- |
| 字形 | glyph | 一个字符画出来长什么样；同一个字符可以有多个字形 |
| 轮廓 | outline | 字形的贝塞尔曲线，填充后就是笔画 |
| 字体单位 | font unit | 字体内部的坐标刻度，**不等于像素** |
| em 方框 | em square | 设计时的参考方格，边长等于 `unitsPerEm` |
| 表意指令 | hinting | 早期小字号下微调笔画落点的指令，现在用得越来越少 |
| 豆腐块 | tofu | 缺字形时显示的方框（`.notdef`） |
| 字形索引 | glyph ID / GID | 字体内部给每个字形编的号；`0` 永远是 `.notdef` |

## 度量（垂直方向）{#metrics}

| 中文 | English | 一句话 |
| --- | --- | --- |
| 基线 | baseline | 拉丁字母坐的那条线，也是 y = 0 |
| x 高度 | x-height | 小写字母 `x` 的高度，很影响“看起来有多大” |
| 大写高度 | cap height | 大写字母的高度 |
| 升部 / 降部 | ascender / descender | 字形在基线以上 / 以下能伸到多远 |
| 行距 | leading | 行与行之间的空隙（设计师的说法） |
| 行高 | line height | 一行文字占的总高度（CSS 的说法） |
| 字体自带行距 | line gap | 字体文件里建议的行间空隙 |

## 水平方向与间距 {#spacing}

| 中文 | English | 一句话 |
| --- | --- | --- |
| 字距 | tracking / letter-spacing | 整体把字符与字符之间拉开或收紧 |
| 字偶距 | kerning | 针对**成对**字符的修正，典型是“AV”“To” |
| 字符宽度 | advance width | 排版时一个字形占掉的水平距离 |
| 侧边距 | side bearing | 字形轮廓到字符边界框左右两边的距离 |

## Unicode 与字符 {#unicode}

| 中文 | English | 一句话 |
| --- | --- | --- |
| 码位 | code point | 字符的编号，写作 `U+0041` |
| 区块 | block | 连续的一段码位范围，如“基本拉丁字母” |
| 已分配 | assigned | 这个码位已经有正式名字（**不等于**某个字体有它的字形） |
| 组合字符 | combining mark | 附加在前一个字符上的符号，如重音 |
| 变体选择符 | variation selector | 指定“这个字符要哪一种字形”的附加码位 |
| 整形 | shaping | 把码位序列变成字形序列的过程（连写、连字、定位） |
| 回退 | fallback | 当前字体没有字形时，浏览器换下一个字体去画 |

## 书写系统 {#scripts}

| 中文 | English | 一句话 |
| --- | --- | --- |
| 书写系统（文字） | writing system / script | 一门语言写下来的系统；同一门语言可以换系统 |
| 字母表 | alphabet | 元音、辅音各有独立字母，拼起来成词（拉丁、希腊、西里尔） |
| 辅音音素文字 | abjad | 只写辅音，元音靠读者补（阿拉伯、希伯来） |
| 元音附标文字 | abugida | 辅音字母自带一个默认元音，换元音要加符号（天城文、泰文） |
| 音节文字 | syllabary | 一个符号一个音节，不是音素（假名、切罗基文） |
| 连写 | cursive joining | 相邻字母按位置换形并连起来（词首 / 词中 / 词尾形） |
| 双向文字 | bidirectional text | 同一行里从左往右与从右往左混排（阿拉伯文 + 拉丁字母、数字） |
| 变音符 | diacritic | 附加在字母上的点、横、撇，如 é 上的重音符 |
| 字素簇 | grapheme cluster | 用户眼里的「一个字」，可能由好几个码位叠出来 |

四类文字的差别见 [书写系统一览](/writing-systems)；连写与双向的坑见 [书写方向与连写](/)writing-direction)；变音符与字素簇见 [组合字符](/)combining-character)。

## CSS 与网页 {#css}

| 中文 | English | 一句话 |
| --- | --- | --- |
| 回退栈 | font stack | `font-family` 里那一串字体名，以及末尾的通用族 |
| 通用族 | generic family | `serif` / `sans-serif` / `monospace` / `system-ui`，由浏览器决定用哪个字体 |
| 字体特性 | OpenType feature | 字体里可选的行为，用四个字母的标签表示，如 `liga`、`kern`、`tnum` |
| 子集 | subset | 只保留需要的字符，减小文件 |
| 布局位移 | layout shift / CLS | 字体晚到时文字跳动，影响阅读体验 |

## 站内相关文章 {#related}

- [字体文件里有哪几张表](/)font-tables-overview)：每个字段出自哪里
- [码位、U+、平面与代理对](/)unicode-codepoints)、[区块与已分配](/)unicode-blocks)：Unicode 那一半
- [行高（leading）](/)line-height-leading)、[字距与字偶距](/)tracking-kerning)：设计师常用的两个词
- [font-family 与回退栈](/)css-font-family)、[font-weight 与 bold 的对应](/)css-font-weight)：前端那一套
- [度量图怎么读](/)how-to-read-metrics)：把上面这些数值落到一张图上

## 延伸阅读

- Microsoft Typography：OpenType 规范，每张表一节
- MDN：CSS Fonts 与 CSS Text 模块
- Unicode 标准与 UAX 文档：码位、区块与字符属性的权威出处
