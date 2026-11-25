---
title: 小型大写
description: 大写形状、小写高度的一套字形。真做出来的和缩出来的不一样，CSS 里三种写法结果也不同。
keywords: 小型大写, small caps, smcp, c2sc, petite caps, 小型大写字母
section: design
order: 11
updated: 2026-11-07
sourceSite: zh.wikipedia.org
sourceTitle: 小型大写字母
sourceRevid: 95066232
sourceUrl: https://zh.wikipedia.org/w/index.php?oldid=95066232
sourceLicense: Creative Commons Attribution-Share Alike 4.0
sourceLicenseUrl: https://creativecommons.org/licenses/by-sa/4.0/deed.zh
sourceRetrieved: 2026-11-07
sourceChanges: 删除了全部图片、公式、引用角标、信息框、表格标题与“参阅”小节；正文文字未改动。
hintTitle: 小型大写
hint: 大写字母的形状、大约 x 高度的大小，是单独设计的一套字形。OpenType 里是 smcp 与 c2sc。
---

**小型大写字母**（英语：**small capitals**，简称**small caps**）是西文[字体](/)fonts-families-faces)设计中的一种字符形式。这些字母的形状（字形）和大写字母相同但尺寸较小。一般来说，小型大写字母的高度等于一个x字高，和大部分的小写字母一样；但是在部分字体中，小型大写字母的高度会比x字高略高一些，如Tiro Typeworks设计的一些字体中，小型大写字母的高度常比x字高超出30%。为区分两者，x字高的形式被称作**特小型大写字母**（**petite caps**）。精心设计的小型大写字母并不是简单的把大写字母在尺寸上缩小而已，而要做一些笔画上的修正，保持更宽的纵横比以保证可读性。

许多文字处理软件和桌面排版系统中都包括一个选项来设置字符的**小型大写字母**，使用之后可以保留大写字母样式，并同时把小写字母转换成小型大写字母。但是具体的处理方式根据排版环境而有所不同：有一些可以真正调用字体中的小型大写字母信息，显示如"Latvia joined Nato" on March 29, 2004"这样的文本，但是大部分现代电脑字体并没有含有小型大写字母，所以排版系统就简单的自动将大写字母缩小，使得部分字符看起来比例失调。

## 用法 {#用法}

小型大写字母常用于全部大写的文章当中，以提高可读性。许多美国杂志在使用首字母缩略字的时候通常采用这个办法，如“北约”一词的英文常在排版的时候写作"Nato"。另外“公元前”“公元”这样的年号，即"ad"和"bc"也经常采用小型大写字母，写作"From 4004 bc to 525 ad."

另外，在表示键盘快捷键的时候也常用小型大写字母，如：

-   ："The keyboard shortcut in Microsoft Word for small caps is Ctrl + Shift + K."

然而其最常见的用法是《圣经》英语译本中的“上主”（四字神名）一词。这个词通常被写成"Lord"。而且在希伯来原文中使用Adonai的时候写成普通的Lord，使用Yaweh的时候写成"Lord"来区别。

一些英法媒体使用小型大写字母来表示人名中的姓氏，这个办法在书写西班牙或者中文等，和英文姓名顺序不同的时候特别有帮助。如: Don Quixote de La Mancha（堂吉诃德）和Mao Zedong（毛泽东）。

由于在罗马时代还没有小写字母，所以当时的石碑都是大写字母。在引述这些石碑的时候也常使用小型大写字母。如

-   ：Sir Christopher Wren's tomb in St Paul's Cathedral reads, in Latin, simply "monumentum requiris circumspice"

在国际音标里面，为了给一些发音赋予适当的字母，有些音也用小型大写字母，如双唇颤音、清会厌擦音等。

### 法律文章引用格式 {#法律文章引用格式}

按照美国法律界通用的《The Bluebook - A Uniform System for Legal Citation》中的要求，在撰写法律评论和其他法律期刊的文章时，引用的书籍名称和作者姓名要应用这种小型大写字母格式。但是在法律实务的文件中，比如备忘录、起诉状等，小型大写字母在任何情况下**绝对不适用**。

## 对小型大写字母的支持 {#对小型大写字母的支持}

### 字体 {#字体}

[OpenType](/)opentype)[字体](/)fonts-families-faces)标准通过`smcp`、`c2sc`特性提供转变一般字母为小型大写字母的支持。一款字体或许以`smcp`转变小写字母为小型大写字母，并以`c2sc` 转变大写字母为小型大写字母。

并非所有字体都能找到小型大写字母，以其最初目的是用于正文，因而在没有为这一目的设计的字体中（如多数的无衬线体）无法找到。有些字体族特别是铅字字体数字化版本中，粗体或斜体缺少小型大写字母，只有常规体才有。这是因为这一般只用在正文里面，而且粗体和斜体小型大写字母被认为是不必要的。

### 文字处理器 {#文字处理器}

专业的桌面出版软件支持生成小型大写字母，包括Quark XPress和[Adobe](/credits/maker/adobe-systems) Creative Suite应用。

多数文字处理软件，包括Microsoft Word和Pages，在用Hoefler Text这样的OpenType字体的时候无法替换真小型大写字母，而是产生缩小的形式。这些程序必须使用以分离的样式包含真小型大写字母的字体。少数自由开源字体有这一特性，一个例外就是Georg Duffner的[EB Garamond](/fonts/eb-garamond-regular)。LibreOffice Writer从5.3版本开始就支持真小型大写字母，在字体名称输入框输入字体名称的时候附上带有字体特性及数值的语法即可开启，例如`EB Garamond 12:smcp=1`。6.2版本还可以通过字符对话框切换。

### Unicode {#Unicode}

虽然小型大写字母使用频率不是非常高，但是为了表示一些音标，Unicode在国际音标扩展、音标扩展和拉丁字母扩展-D等区块（0250–02AF、1D00–1D7F、A720–A7FF）定义了一些小型大写字母。例如U+0280 ʀ 表示小舌颤音。这些字符官方名称类似于latin letter small capital a（小型大写拉丁字母A）。

截至Unicode 11.0，在ISO基本拉丁字母中只有X缺少小型大写字母版本。

下表展示ISO基本拉丁字母的Unicode小型大写字母：

|     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A   | B   | C   | D   | E   | F   | G   | H   | I   | J   | K   | L   | M   | N   | O   | P   | Q   | R   | S   | T   | U   | V   | W   | X   | Y   | Z   |
| ᴀ   | ʙ   | ᴄ   | ᴅ   | ᴇ   | ꜰ   | ɢ   | ʜ   | ɪ   | ᴊ   | ᴋ   | ʟ   | ᴍ   | ɴ   | ᴏ   | ᴘ   | ꞯ   | ʀ   | ꜱ   | ᴛ   | ᴜ   | ᴠ   | ᴡ   | \-  | ʏ   | ᴢ   |

此外，个别少见的拉丁字母、几个希腊字母和一个西里尔字母也有小型大写字母编码：

|     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 拉丁字母 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 希腊字母 |     |     |     |     |     | 西里尔字母 |
| Æ   | Ƀ   | Ð   | Ʒ   | Ǝ   | Ɠ   | Ɨ   | Ł   | ꟽ/Ɯ | и   | Œ   | Ɔ   | Ȣ   | Я   | ᴚ   | ʁ   | ꭆ   | ꝶ   | ꝵ   | Ʉ   | Γ   | Λ   | Π   | Ρ   | Ψ   | Ω   | Л   |
| ᴁ   | ᴃ   | ᴆ   | ᴣ   | ⱻ   | ʛ   | ᵻ   | ᴌ   | ꟺ   | ᴎ   | ɶ   | ᴐ   | ᴕ   | ᴙ   | ᴚ   | ʁ   | ꭆ   | ꝶ   | ꝵ   | ᵾ   | ᴦ   | ᴧ   | ᴨ   | ᴩ   | ᴪ   | ꭥ   | ᴫ   |

上标小型大写字母：ᶦ ᶧ ᶫ ᶰ ʶ ᶸ。

组合用小型大写字母：◌ᷛ ◌ᷞ ◌ᷟ ◌ᷡ ◌ᷢ。

注意自从这类字形来自不同的区块，它们可能不会以相同的大小和样式呈现，因为仅少数字体有完整支持。

### CSS中的小型大写字母 {#CSS中的小型大写字母}

小型大写字母在CSS中通过"font-variant: small-caps;"命令实现。如HTML Small caps can be specified in the web page presentation language CSS using `font-variant: small-caps`. For example,

| 代码  | 渲染为 |
| --- | --- |
| `<span style="font-variant: small-caps">Jane Doe</span>` | Jane Doe |
| `<span style="font-variant: small-caps">AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz</span>` | AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz |

这些字符的样式只是受到 CSS 的影响，因此用户在复制时仍然是原文。

CSS3 可以指定[OpenType](/)opentype)的特性表，即`font-feature-settings: 'smcp';`（在2014年5月时受更广泛使用）。smcp只会在带有这些特性的字体和支持这种用法的的系统环境上开启小型大写字母，而不会触发仿小型大写字母。

| 代码  | 渲染为 |
| --- | --- |
| `<span style="font-variant-caps: small-caps">Jane Doe</span>`<br>CSS语言层面上等于`font-variant: small-caps` | Jane Doe |
| `<span style="font-feature-settings: 'smcp'">AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz</span>` | AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz |

更小号的petite-caps在CSS3里也有支持。其中`font-feature-settings: 'pcap'`是OpenType写法，只会在带有这些特性的字体和支持这种用法的的系统环境上开启小型大写字母，而不会触发仿特小型大写字母。

| 代码  | 渲染为 |
| --- | --- |
| `<span style="font-variant-caps: petite-caps">Jane Doe</span>`<br>CSS语言层面上等于`font-variant: petite-caps` | Jane Doe |
| `<span style="font-feature-settings: 'pcap'">AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz</span>` | AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz |

## 逸事 {#逸事}

UNIX操作系统的名字原来是"Unix"，之后在技术文本中排版使用了小型大写字母，直到后来演变为全部大写。
