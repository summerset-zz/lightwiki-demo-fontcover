---
title: name 表
keywords: name 表, 家族名, PostScript 名, 命名, 本地化, nameID, WWS
description: 字体里所有能念出来的名字都在这张表：家族名、子家族名、PostScript 名、多语言名、许可证。
section: fields
order: 1
updated: 2026-11-02
draft: false
---

界面上显示的字体名不是从文件名来的，也不是从系统某处推测的，它来自字体文件里的 `name` 表。这张表是一串编号到文字的记录，编号规定了这条文字**算哪一类名字**。

## 这张表长什么样 {#what}
<!-- hint: name 表 | name 表保存家族名、样式名、厂商与许可等文字信息，并按平台和语言分组。 -->

结构很简单：

- 表头：版本号、记录条数；
- 每条记录：平台、编码、语言、**编号（nameID）**、长度、数据偏移；
- 后面是真正的字符串。

所以同一个名称可以有**很多条**记录：中文一条、英文一条、Macintosh 平台一条、Windows 平台一条。谁先被用上，取决于读它的程序怎么挑。

## 最常用的几个编号 {#ids}

| nameID | 含义 | 典型值 |
| --- | --- | --- |
| 0 | 版权声明 | `Copyright 2020 The Inter Project Authors` |
| 1 | 家族名 | `Inter` |
| 2 | 子家族名 | `Bold`、`Italic`、`Regular` |
| 4 | 完整名 | `Inter Bold` |
| 5 | 版本串 | `Version 3.019` |
| 6 | PostScript 名 | `Inter-Bold` |
| 13 / 14 | 许可证描述 / 许可证地址 | `SIL Open Font License 1.1` + 链接 |
| 16 / 17 | **排版家族名 / 排版子家族名** | `Inter` / `Bold` |
| 21 / 22 | WWS 家族名 / WWS 子家族名 | `Inter Bold` 的另一种归类 |

1 + 2 与 16 + 17 的区别是这张表最容易被忽略的地方：老程序只认 1 和 2，于是 Inter Bold 这一款字体的家族名可能被写成 `Inter Bold`、子家族名写成 `Regular`；而 16 + 17 用来表达它其实属于 Inter 这个家族，是 Bold。前者是兼容，后者才是设计意图。

## 平台与语言 {#platforms}

每条记录都带平台 / 编码 / 语言三件套。实践里最常遇到两组：

- **Windows（platformID 3）**：编码 1 = BMP，10 = 全 Unicode；语言 0x0409 英文、0x0804 简体中文、0x0404 繁体中文；
- **Macintosh（platformID 1）**：语言 0 英文，其余按 Mac 的语言码。

更老的字体还可能只在 Macintosh 平台写了名字，Windows 那一组只剩一条版权或许可证。**只挑一个平台读到底会读不到名字**，正确做法是按字段回落：优先想要的平台，没有就换下一个。

## 本地化名字与本站的微软雅黑 {#localized}
<!-- hint: 本地化名称 | name 表按语言保存字体的名称，例如中文为“微软雅黑”，英文为 Microsoft YaHei。 -->

中文用户看到 `Microsoft YaHei` 会愣一下。这张表里本来就有中文记录（nameID 1 或 16 的中文条目），只是很多程序只取了英文。

本站把 nameID 1 / 16 的多语言条目存成 `localizedNames`，家族列表按界面语言显示本地名，把真名挂在悬停提示里。要注意的是：**搜索、选中、收藏用的始终是真名**（`Microsoft YaHei`），显示名只出现在界面上，否则同一个人搜雅黑和 YaHei 会得到两套结果。

## 三个常踩的坑 {#pitfalls}

1. **PostScript 名有严格限制**：不超过 63 个字符，只用 ASCII 33–126，且不能出现空格和 `[](){}<>/%`。它出现在 PDF 与系统字体缓存里，写错不会被某些系统拒绝，但会静静出问题。
2. **WWS 与 typographic 不是一回事**：WWS（Weight / Width / Slant）是为了让程序按粗细、宽窄、斜度归类而设的；typographic 名保的是设计师的分类。两者不一致时，不同系统会显示不同的名字。
3. **名字可以撒谎**：`name` 表只是文本，没有校验。一个文件把家族名写成 `Arial` 也能存进去。所以本站的家族归并除了名字，还会参考别的字段。

## 本站怎么用它 {#this-site}

- 家族列表与详情页的标题：`name` 的家族名（优先排版家族名，缺了用家族名）；
- 语言切换时的本地名：同一 nameID 的其它语言条目；
- 搜索别名：把本地名与常见中文叫法摊平成一张别名表；
- 字形数量等数字**不在这张表**，分别来自 `maxp` 与 `OS/2`。

## 延伸阅读

- OpenType 规范：`name` 表（含完整的 nameID 列表与平台编码表）
- OpenType 规范：`name` 表“Naming”一节（WWS 与 typographic 名的取舍）
