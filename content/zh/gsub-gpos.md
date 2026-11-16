---
title: GSUB 与 GPOS
keywords: GSUB, GPOS, GDEF, 连字, 字偶距, kern, 特性, locl, 小型大写
description: 三张布局表决定字符怎么被替换、怎么被挪位置。有表不等于生效。
section: fields
order: 6
updated: 2026-11-07
draft: false
---

`cmap` 只回答这个码位用哪个字形。至于 `f` 和 `i` 要不要连成一个字形、`A` 和 `V` 之间要不要收紧、中文标点要不要变窄，全在另外三张表里。它们的结构比前面几张复杂得多，但概念只有三个。

## 三张表的分工 {#three}

| 表 | 全名 | 管什么 |
| --- | --- | --- |
| `GSUB` | Glyph Substitution | **替换**：把哪个字形换成哪个 |
| `GPOS` | Glyph Positioning | **定位**：把字形往哪挪 |
| `GDEF` | Glyph Definition | **分类**：告诉上面两张表这个字形是基字、连字还是标记 |

## 共同的结构 {#structure}

两张表都是同一套四层结构：

1. **ScriptList**：按书写系统分组，标签如 `latn`（拉丁）、`hani`（汉字）、`DFLT`（默认）；
2. **LangSys**：同一书写系统下的语言变体，如 `ZHS `（简体中文）、`ZHT `（繁体）、`JAN `（日文）；
3. **FeatureList**：每个语言下有哪些特性，用四个字母标记；
4. **LookupList**：特性真正指向的查找，即替换规则或定位规则。

所以这个字体支不支持小型大写 = 在 `GSUB` 的某个语言系统里找得到 `smcp` 这个特性。

## GSUB 能做的几件事 {#gsub}

| 查找类型 | 做什么 | 例子 |
| --- | --- | --- |
| 单替换 | 一个字形换成另一个 | `a` → `a.alt` |
| 多替换 | 一个字形拆成多个 | 连写的 `æ` 拆回 `a e` |
| 替代替换 | 同一位置给几个候选 | 样式替代 `salt` |
| 连字替换 | 多个字形合成一个 | `f` + `i` → `fi` |
| 上下文替换 | 看前后文决定换不换 | 数字在分数里换成分子字形 |
| 链式上下文 | 更复杂的前后文规则 | 印度文字的连写 |

<figure style="margin: 1.75rem 0">
  <svg viewBox="0 0 320 120" width="100%" role="img" aria-label="两个字形替换成一个连字">
    <g fill="none" stroke="currentColor" opacity="0.35">
      <rect x="16" y="24" width="44" height="56" rx="6" />
      <rect x="60" y="24" width="44" height="56" rx="6" />
      <rect x="168" y="24" width="88" height="56" rx="6" />
    </g>
    <g font-family="Georgia, serif" font-size="30" fill="currentColor">
      <text x="30" y="66">f</text>
      <text x="76" y="66">i</text>
      <text x="190" y="66">fi</text>
    </g>
    <text x="122" y="62" font-size="22" fill="currentColor" opacity="0.6">→</text>
    <g font-size="10" font-family="system-ui, sans-serif" fill="currentColor" opacity="0.6">
      <text x="16" y="102">两个字形</text>
      <text x="168" y="102">一个字形（liga）</text>
    </g>
  </svg>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; opacity: 0.65">GSUB 的连字替換：把相邻的两个字形换成一个。方框代表字形槽，不是设计稿上的间距。</figcaption>
</figure>

## GPOS 能做的几件事 {#gpos}

| 查找类型 | 做什么 | 例子 |
| --- | --- | --- |
| 单调整 | 整个字形的位移 | 上标往上挪 |
| 成对调整 | 两个字形之间加/减距离 | **字偶距**（`kern`） |
| 附着 | 把标记挂到基字上 | 重音、阿拉伯文的音符 |
| 连写附着 | 连着写的时候挂上去 | 阿拉伯文 |
| 标记到标记 | 标记挂在标记上 | 多重附加符号 |

## 常用的特性标签 {#tags}
<!-- hint: 特性标签 | 小型大写、旧式数字等替换由 GSUB、GPOS 中的四字母标签控制，CSS 用 font-feature-settings 启用。 -->

| 标签 | 名字 | 默认 |
| --- | --- | --- |
| `liga` | 标准连字（`fi`、`fl`） | 开 |
| `clig` | 上下文连字 | 开 |
| `dlig` | 可选连字 | 关 |
| `smcp` | 小型大写 | 关 |
| `onum` / `lnum` | 旧式 / 等高数字 | 关 / 开 |
| `tnum` / `pnum` | 等宽 / 比例数字 | 关 / 开 |
| `frac` | 分数 | 关 |
| `subs` / `sups` | 下标 / 上标 | 关 |
| `salt` / `ss01`–`ss20` | 样式替代 / 风格集 | 关 |
| `locl` | 本地化字形（按语言换字形） | 按语言 |
| `kern` | 字偶距（在 GPOS 里） | 开 |
| `palt` | 中文标点比例宽度 | 关 |

默认那一列是排版引擎的通常行为，不是规范强制；不同引擎对 `dlig` 之类可能不同。

## 标签不止一种 {#tag-kinds}
<!-- hint: 基线标签 | 决定不同文字排在一行时按谁的底线对齐，存在 BASE 表里，不在 GSUB / GPOS。 -->

<!-- source: zh.wikipedia.org | OpenType | 94950647 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/deed.zh | 摘译“版式标签”一节；只保留四类标签与基线表的含义，删去编辑器与参见链接 -->

上一节列的 `smcp` 只是**特性标签**。OpenType 的标签一共四类，都是四个字符以内，含义各不相同：

| 类别 | 用在哪 | 例子 |
| --- | --- | --- |
| 文本标签（script） | ScriptList，按书写系统分组 | `latn` 拉丁、`cyrl` 西里尔、`arab` 阿拉伯、`hani` 汉字 |
| 语言标签（language） | LangSys，书写系统下的具体语言 | `ZHS` 简体中文、`ZHT` 繁体、`JAN` 日文 |
| 特性标签（feature） | FeatureList，可选的字形效果 | `smcp`、`liga`、`tnum` |
| 基线标签（baseline） | `BASE` 表，多文字混排时对齐用 | `romn` 罗马字母、`ideo` 表意文字 |

最后那一类容易漏：基线标签决定**拉丁文字与汉字排在一行时按谁的底线对齐**。

| 标签 | 横向文字 | 竖排文字 |
| --- | --- | --- |
| `romn` | 简单字母文本（拉丁、西里尔、希腊）的基线 | 同上，顺时针转 90° 后的基线 |
| `ideo` | 表意文字字面框的底边 | 字面框的左边 |
| `icfb` / `icft` | 表意文字字面框的底边 / 顶边 | 左边 / 右边 |
| `math` | 数学符号居中时的基线 | 竖排居中时的基线 |
| `hang` | 藏文发音符号的基线 | 竖排时的基线 |

所以字体“明明有中文，混排却对不齐”时，看的不是 `GSUB`，而是 `BASE` 表里有没有 `ideo` / `icfb` 这几条。

## 同一个字，不同语言 {#locl}
<!-- hint: locl | locl 按语言替换字形。中日韩共用一个码位时，同一个字符会随 lang 呈现不同写法。 -->

`locl` 特性让同一个码位在简体中文、繁体中文、日文环境下画出不同的字形。

典型的例子是骨、直、门这类字：中日的标准写法笔画不同，但**码位相同**。所以这个字体在中文里长这样、在日文里长那样不是 bug，是 `locl` 按语言系统换了字形。

这也解释了为什么做多语言排版时，`lang` 属性不只是给拼写检查用的。

## 有表 ≠ 生效 {#not-enough}

`GSUB` 里写了规则，还要满足三个条件才看得见：

1. 渲染引擎去查了这张表（有些简化引擎直接忽略）；
2. 文本里真的出现了那个组合；
3. 特性默认开启，或者用户/样式显式开启。

所以这个字体有连字和这段文字里有连字，是两个不同的判断。

## 本站为什么绕开它们 {#this-site}

分析字体时，样例图需要取字形轮廓。有些老库在遇到 `GSUB` 时会直接抛错（因为字形数据是替换后的、与原始轮廓对不上），所以本站对这条路径做了兜底：撞上就退回逐字形取轮廓。

这也意味着**样例图里不体现连字效果**，它展示的是这个字体的字形，不是这段文字排出来的样子。

## 延伸阅读

- OpenType 规范：`GSUB`、`GPOS`、`GDEF`
- OpenType 规范：feature tags 的完整列表
- 本站：[cmap 表](/docs/cmap-table)
