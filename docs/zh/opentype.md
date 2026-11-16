---
title: OpenType
description: 微软与 Adobe 联合制定的字体容器格式：两种轮廓都能装，版式特性写在 GSUB / GPOS 里。
keywords: OpenType, OTF, CFF, TrueType, 字体格式, 版式特性, opentype
section: basics
order: 5
updated: 2026-11-07
sourceSite: zh.wikipedia.org
sourceTitle: OpenType
sourceRevid: 94950647
sourceUrl: https://zh.wikipedia.org/w/index.php?oldid=94950647
sourceLicense: Creative Commons Attribution-Share Alike 4.0
sourceLicenseUrl: https://creativecommons.org/licenses/by-sa/4.0/deed.zh
sourceRetrieved: 2026-11-07
sourceChanges: 删除了全部图片、公式、引用角标、信息框、表格标题与“参见 / 外部链接”类收尾小节；正文文字未改动。
---

**OpenType**，是一种可缩放字型（scalable font）电脑字体类型，采用PostScript格式，是美国[微软](/credits/maker/microsoft)公司与[Adobe](/credits/maker/adobe-systems)公司联合开发，用来替代[TrueType](/docs/truetype)字型的新字型。这类字体的文件扩展名有`.otf`、`.ttf`、`.ttc`，类型代码是`OTTO`，现行标准为OpenType 1.9。

OpenType最初发表于1996年，并在2000年之后出现大量字体。它源于微软公司的TrueType Open字型，TrueType Open字型又源于[TrueType](/docs/truetype)字型。OpenType font包括了Adobe CID-Keyed font技术。Adobe公司已经在2002年末将其字体库全部改用OpenType格式。到2005年大概有一万多种OpenType字体，Adobe产品占了三分之一。

## 历史 {#历史}

OpenType之前的主流是苹果公司和微软开发的[TrueType](/docs/truetype)类型，还有Adobe公司开发的Type 1（PostScript）字体类型。微软在1994年独自开发了“TrueType Open”类型，之后1996年Adobe加入开发，增加了其在Type 1字体中使用的对字体轮廓的支持，OpenType这个名字于是便用来称呼合并之后的技术。

在后来的十几年中，Adobe和微软继续开发改进OpenType格式，在2005年末，OpenType开始申请成为国际标准组织（ISO）的公开标准。这个新标准已经升级到OpenType 1.4，以适应ISO语言标准的一些变化，之后其被称为“开放字体类型（Open Font Format）”。这个标准在2007年3月以ISO/IEC 14496-22发布。

OpenType于2016年发布了1.8版规范，引入了“可变字体”的功能。支持通过调节一定的参数来自由改变文字的形状。

在OpenType1.9中，引入了COLR表的第二个版本，它增加了额外的图形功能。增强版最初由谷歌提出并与微软联合开发。增强的图形功能包括对三种类型的渐变、仿射变换、合成和混合模式的支持，以及定义可重用组件的能力。这些增强功能为COLR表提供了“SVG”表的所有图形功能，除了描边之外，应用程序应该支持这些功能。它还添加了合成和混合模式，对“SVG”表的支持被认为是可选的（因为这些在SVG中作为滤镜效果实现）。此外，COLR表的增强功能与OpenTypeFontVariations集成在一起，而“SVG”表则无法做到这一点。自版本98起，Chromium浏览器引擎支持增强的COLR表。

## 描述 {#描述}

OpenType使用TrueType字体通用的sfnt架构，但其加入若干“智能字体”（smartfont）选项，可以加强字体的字形和语言支持能力。OpenType字体中的字形（glyph）、轮廓数据可以在两种格式中任选其一：一个是在'glyf'表中TrueType格式轮廓，另一个是在'CFF '表中的CFF（压缩字体格式，Compact Font Format）格式轮廓。CFF轮廓数据是基于PostScript语言Type 2字体格式。表格名'CFF '长度为四个字符，并且以一个空格字符结尾。

在如版式等大多数情况下，轮廓数据格式是什么类型并不重要，但这两种格式的区别在图元光栅化（rasterisation）的时候就有区别。而单从“OpenType”一词中看不出来使用的是哪种数据格式，所以有时候使用OpenType (PostScript flavor)、OpenType CFF、或者OpenType (TrueType flavor)等称呼加以区别。

OpenType的主要特征有：

-   字体编码基于统一码，可以支持任何文本，或者同时支持多种文本。
-   一个OpenType字体可以带有最多65,536个字形。对于中文字库而言，最基本的字汇应该包含Big5的13,060个汉字或是GB2312-80标准的6763个常用字型，这些字应该能满足一般用户的使用，对于户籍管理、银行系统和出版社等用户而言需要2万多字甚至7万多字的支持。
-   字体有高级字形功能，可以进行对复杂文本进行充分的字形处理，并能通过更简单的文字施加更复杂的字形效果，比如用罗马字母脚本书写英文。
-   字体文件可以拓展到跨平台，能够在Mac OS，Windows和一些Unix系统中进行设置。
-   若不含变体字等拓展字形和拓展文字性能，OpenType CFF字体比Type 1要小

## 与其他类型比较 {#与其他类型比较}

与苹果公司的Apple Advanced Typography（简称AAT，旧名GX Typography）比较，OpenType在字形选项上更不灵活，但是在语言相关的选项和支持略胜一筹。OpenType比AAT更为成功，它现在有大量的字体和支持的应用程序，使AAT成为过时的技术。AAT的单平台性能使其缺乏苹果以外的大厂商的支持。

从开发者的角度来说，在一般情况下OpenType比AAT更容易开发。首先，简单声明替换和OpenType的定位比AAT的状态表更简单易懂。其次，Adobe的认证策略不需要改变源代码，运行第三方字体编辑应用程序，如FontLab、FontMaster去添加有关性能支持。虽然Adobe的文本驱动代码支持不如微软的单独开发工具更为直观，但是它的VOLT（视觉开放字体版式工具，Visual OpenType Layout Tool），一个制作字体的工具集成软件还是比较受欢迎的。

另一个区别是，OpenType支持framework（如微软的Uniscribe），若要处理阿拉伯语等语言的时候只需要提供一些特殊的语言处理知识。而在AAT中，ATT字体开发者需要对该语言字体的全面认识。这意味着AAT可以处理任何特殊语言，但是需要字体开发者的相当高度的语言知识。另外，OpenType字体更容易制作，但只能支持应用程序和操作系统能够识别的复杂文字。 在支持OpenType之前，Adobe针对高级文字处理中曾推出“multiple master fonts”，但其缺乏OpenType的异体字和语言控制，在字体形状上有更多的控制参数。

## OpenType支持 {#OpenType支持}

OpenType支持有以下几个方面：所有应用程序和多数操作系统能在使用旧字体的同时使用OpenType字体；特别要注意的是，统一码的拓展语言支持；支持阿拉伯语、印度语言等“复杂文本”；以及英语等拉丁文本的高级字形支持等。

在微软的操作系统中，OpenType TT字体（.TTF）能向后兼容，因此其支持所有Windows系统。OpenType PS字体（.OTF）支持Windows 2000或以后的版本。在Windows 95／98／NT／Me系统中需要安装Adobe Type Manager才能使用基本的罗马字符支持。

通过统一码的拓展语言，可以在大多数的视窗应用程序中同时对OpenType和TrueType支持，包括Publisher，大多数的Adobe应用程序，微软Office 2003（但Word 2002不行），以及多数的Mac OS应用程序，包括苹果自己开发的TextEdit和Keynote。在Mac OS X中，通过文字处理Mellel，OpenType得到了全面支持。

OpenType通过微软的Office和Publisher等软件支持复杂书写文本，Adobe InDesign也提供日文的拓展OpenType功能，但是不直接支持中东和印度文本——Adobe为支持阿拉伯语、希伯来语等中东语言，单独发行另外的InDesign版本。

拉丁语言文本的高级字形支持主要是通过Adobe的应用程序，如Adobe InDesign、Adobe Photoshop和Adobe Illustrator来支持。QuarkXPress 6.5及其以下版本不支持统一码，因此含有WinANSI/MacRoman字符表外的文字在OpenType字体中将无法正常显示（同理，在其他使用统一码的字体格式也不行）。Corel公司的CorelDRAW不支持OpenType字形功能。尽管如此，Quark公司在2006年5月发布的QuarkXPress 7中开始支持OpenType，和Adobe程序达到类似的效果。

另外，Windows Presentation Foundation管理代码执行支持OpenType CFF字体和一些高级字形功能，如连写、旧体数字、花体字形、拐点、超文本和次文本，小型大写字母、字形替换、多重基线、前后／风格化字间距调整、行间调整、注释字符等等。

Mac OS X v10.4及其之后系统中的Apple Advanced Typography也支持OpenType拉丁文本语言的高级字形功能，如小型大写字母，旧体数字和多种连写。但是它不支持前后字母间距调整、定位格式、字形倒序等，因此Mac OS X v10.4不能通过OpenType支持阿拉伯语、印度的文字——这些文本通过苹果自己的AAT字体来支持。

在自由软件环境，如Linux中，OpenType支持是通过FreeType项目来支持的，包括自由执行X Window System，如Xorg。

### Mac OS X系统支持的特性 {#Mac_OS_X系统支持的特性}

在Mac OS X v10.4（Tiger）中，苹果公司开始在操作系统中支持OpenType功能，减轻了程序开发者的任务，但是仍有一些需要注意的地方：

-   在Mac OS 10.4.0到10.4.3中，若字体被识别为具有OpenType表，任何AAT表值将被忽略（之后，AAT功能优先于OpenType功能。）
-   只有以下的GDEF/GPOS/GSUB功能标签被确认是支持的：
    -   liga: Common ligatures普通连写
    -   dlig: Discretionary ligatures
    -   sups: Superior/superscript position
    -   tnum: Tabular numerals表用数字
    -   pnum: Proportional numerals比例数字
    -   onum: Old style numerals旧体数字
    -   lnum: Lining numerals线性数字
    -   sinf: Scientific inferiors
    -   zero: Slashed zero斜线零
    -   ital: Italics斜体
    -   trad: Traditional CJK forms传统CJK样式
    -   jp78: JIS 1978 CJK forms日本JIS1978CJK样式
    -   jp83: JIS 1983 CJK forms日本JIS1983CJK样式
    -   expt: Expert CJK forms专家CJK样式
    -   nlck: NLC Kanji forms NLC汉字格式
    -   ruby: Ruby notation forms注音字符样式
    -   pwid: Proportional CJK widths比例CJK宽度
    -   fwid: Full CJK widths全角CJK宽度
    -   hwid: Half CJK widths半角CJK宽度
    -   twid: Third CJK widths三分之一CJK宽度
    -   qwid: Quarter CJK widths四分之一CJK宽度
    -   palt: Alternate proportional CJK widths变C比例JK宽度
    -   halt: Alternate half CJK widths变半角CJK宽度
    -   vert or vrt2: Optimised kana vertical alternates
    -   *本列表不完整*
-   以下功能是被确认**不**支持的：
    -   mark: Mark‐to‐base positioning
    -   mkmk: Mark‐to‐mark positioning
    -   mset: Mark positioning via substitution
    -   nukt: Nukta form
    -   akhn: Akhand ligature
    -   rphf: Reph form
    -   blwf: Below-base form底基线样式
    -   half: Half-form（pre-base form）
    -   pstf: Post-base form
    -   vatu: Vattu variants
    -   pres: Pre-base substitution
    -   blws: Below-base substitution
    -   abvs: Above-base substitution
    -   psts: Post-base substitution
    -   haln: Halant form substitution
    -   blwm: Below-base mark positioning
    -   abvm: Above-base mark positioning
    -   dist: Distances

## SING外字解决方案 {#SING外字解决方案}

2005年Adobe在其创意软件套装Adobe Creative Suite中发表了一个新的技术“外字”（Gaiji）解决方案。

所谓“外字”，源自日语的“表外汉字”（日语：表外漢字，hyōgai kanji）。与拉丁语言不同，在东亚表意文字系统如中文、日文中，没有固定数量的字符集。一般字符集只含有8,000到15,000的常用字，另外数万个非常用字、生僻字，往往没有在各国的标准中给予编码。另外一个情况是异体字：一个表意文字（汉字）在不同的历史时期、地域产生了不同的字形，而一些地名人名等专有名字必须要使用传统的写法，需要使用这些冷僻字形，造成了生僻字问题，日语中称为“外字”问题。

为了处理这些冷僻字，先前已经出现过很多方案，比如在统一码中的私用区域（Private use area）增加编码等。这样的处理方法无法在制定环境以外的地方使用，基于私用区域编码的统一码制作的文档无法通用。另外一个办法就是将其处理成图像，这又导致文字排版的麻烦，因为版面指令无法作用于图像，无法被当成文本搜索，而且由于机器从字体描绘字形和描绘图像的机制完全不同，这样的处理导致插入的冷僻字看起来很突兀。

SING技术是和Adobe Creative Suite 2一起发布的，它允许用户创建新字形，每个新字形作为一个独立的字体打包。这样打包出来的字形称为*字形包（glyphlet）*。这种格式通过Adobe公开的，且基于OpenType。这个包的内容包括字形的[TrueType](/docs/truetype)或CFF轮廓样式，标准OpenType表格，声明字形的尺寸和组合行为，以及元数据，附加信息，如字形包的认证、所属，还有读音或者部首分类等语言方面的分类等。SING字形包也可以使用Fontlab公司的SigMaker3程序创建。

SING（Smart INdependent Glyphlets，智能独立字形包）的规范允许字形包随同文件一起传送，这样包含SING字符的文件也是可携带的，而又不会字符乱码、异常显示。由于字形包的基础是OpenType字体，标准字体机制可以对其进行正常描画。SING规范也可以表述成XML格式，包括在二进制格式中重建字形的所有必要数据。一般情况下，一个字形包需要1-2 kB大小的容量。

## 版式标签 {#版式标签}

OpenType版式标签含有4个字符串，含有字体版式中文本，语言系统，功能和基线等信息。微软的版式标签登陆中，包含了这些标签的使用和命名方法。OpenType特征都是由这些标签信息来体现的，创建特征文本来描述字符如何根据指令来排列。这些特征文本还可以通过高级字体编辑器如FontlabStudio和AsiaFont Studio来制定。

-   **文本标签**

文本标签用来识别OpenType字体中的文本类型。每个标签对应统一码中一个连续的字符区。每个字符标签含有4个或更少的小写字母。如，包含arab来识别阿拉伯字母表，cyrl对应西里尔字母表，latn对应拉丁字母表，等等。

-   **语言标签**

语言体统标签识别OpenType字体中支持的语言系统。如包含ARA对应阿拉伯语，ESP对应西班牙语，HYE对应亚美尼亚语等等。这个代码类似于ISO 639-2，但不尽相同。

-   **功能标签**

功能标签用来识别字符的一些字形特征和功能。

-   **基线标签**

基线标签包含横、竖两个书写方向的信息。

|     |     |     |
| --- | --- | --- |
| 基线标签 | 横轴  | 竖轴  |
| 'hang' | 藏文中发音符号的横写时的基线位置 | 藏文中竖写时的基线位置 |
| 'icfb' | 表意文字字符底边距基线 | 表意文字字符左边距基线 |
| 'icft' | 表意文字字符顶边距基线 | 表意文字字符右边距基线 |
| 'ideo' | 表意文字字面底边距基线 | 表意文字字面左边距基线 |
| 'idtp' | 表意文字字面顶边距基线 | 表意文字字面右边距基线 |
| 'math' | 数学字符居中时的基线 | 书写字符居中、在竖写时的基线 |
| 'romn' | 简单字母文本（拉丁、西里尔、希腊字母）的基线 | 简单字母文本（拉丁、西里尔、希腊字母）在顺时针90度时书写的基线 |
