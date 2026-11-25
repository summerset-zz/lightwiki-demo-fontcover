---
title: 字体表
keywords: 字体表, 表目录, head, name, OS/2, cmap, maxp, sfnt
description: TTF / OTF 其实是一份带目录的档案，每张表管一件事。这一页按本站哪里用到标注。
section: fields
order: 0
updated: 2026-11-02
draft: false
---

一个 `.ttf` 或 `.otf` 不是一坨图形，而是一份**带目录的档案**：文件头写明有哪些表、各自从第几字节开始、有多长，后面按顺序排着这些表。解析字体，就是照着目录把表一张张读出来。

这一页是入口。每张关键的表都有自己的文章，只讲它自己。

## 为什么是表 {#why-tables}
<!-- hint: 表 | 字体文件由若干张表组成，字符映射、轮廓、名称和度量分别存放在不同的表里。 -->

OpenType 从 TrueType 继承了这个结构。最大的好处是**可选**：一个字体可以有 `fvar`（变量轴），也可以完全没有；程序只读自己认识的表，不认识的按长度跳过。

所以新增一种能力往往等于多一张表，而不是把原来的格式改一遍，这也是字体文件能同时被 1990 年代的老软件和今天的浏览器打开的原因。

## 最核心的七张 {#core-seven}

| 表 | 管什么 | 展开 |
| --- | --- | --- |
| `head` | 全局参数：`unitsPerEm`（字体单位一格多细）、整体包围盒、`macStyle` | [head / hhea / post](/)head-hhea-post) |
| `name` | 所有名字：家族名、子家族名、PostScript 名、版权与许可证 | [name 表](/)name-table) |
| `OS/2` | 字重、字宽、`fsSelection`、排版用的上下伸、x 高度、大写高度 | [OS/2 表](/)os2-table) |
| `hhea` | 水平排版的三条基准：ascender / descender / lineGap | [head / hhea / post](/)head-hhea-post) |
| `cmap` | 字符码位 → 字形索引。**这个字体有没有这个字就看它** | [cmap 表](/)cmap-table) |
| `maxp` | 一共有多少个字形 | 见下面其余的表 |
| `post` | 斜体角度、下划线位置与粗细、PostScript 名 | [head / hhea / post](/)head-hhea-post) |

读这七张，就能回答本站检查器里绝大部分问题：这个字体叫什么、有多重、上下伸多少、认哪些字符。

## 其余的表 {#others}

| 表 | 管什么 |
| --- | --- |
| `glyf` / `CFF` / `CFF2` | 真正的字形轮廓（TrueType 用 `glyf`，OpenType/CFF 用 `CFF`） |
| `GSUB` / `GPOS` / `GDEF` | 布局：连字、小型大写、字偶距、上下标（见 [GSUB / GPOS](/)gsub-gpos)） |
| `fvar` / `gvar` / `avar` / `STAT` | 变量字体：轴、每个轴上的字形变化、命名实例 |
| `cvt` / `fpgm` / `prep` | hinting 指令 |
| `DSIG` | 数字签名。实践里基本没人用 |
| `vhea` / `vmtx` | 竖排用的垂直度量 |

有这张表和这张表起了作用是两件事：`GSUB` 里写了连字，也要渲染引擎去查、并且文字里恰好出现那个组合，才看得见。

## 本站哪里用到哪张 {#where-in-site}

| 界面 | 读的表 |
| --- | --- |
| 检查器“基本信息” | `name`（家族与子家族名）、`OS/2`（字重、斜体位）、`maxp`（字形数） |
| 度量图 | `head`（`unitsPerEm`）、`hhea` 与 `OS/2`（三条基线与上下伸）、`post`（斜体角与下划线） |
| Unicode 覆盖 | 只读 `cmap`，其余一概不看 |
| 样例图 | 读轮廓表（`glyf` / `CFF`），并避开 `GSUB` 里的替换规则 |

## 谁来写这些表 {#who-writes}

字体编辑器（FontForge、RoboFont、Glyphs）负责把设计填进这些表，导出时按目标格式打包。所以同一个设计导出成 `.ttf` 与 `.otf`，轮廓表就完全不同，别的表可能一模一样。**格式**和**设计**是两件事。

## 延伸阅读

- Microsoft Typography：OpenType 规范的“Font Tables”一节
- Apple TrueType Reference Manual：`head` / `hhea` / `post` 的原始定义
