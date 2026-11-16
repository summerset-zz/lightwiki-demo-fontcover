---
title: PostScript 字体
description: Adobe 的轮廓格式家族，从 Type 1 到 CFF：今天 OTF 里的字形轮廓就是它。
keywords: PostScript, Type 1, CFF, CID, 字体格式, 轮廓, PostScript字型
section: basics
order: 7
updated: 2026-11-07
sourceSite: zh.wikipedia.org
sourceTitle: PostScript字型
sourceRevid: 95405926
sourceUrl: https://zh.wikipedia.org/w/index.php?oldid=95405926
sourceLicense: Creative Commons Attribution-Share Alike 4.0
sourceLicenseUrl: https://creativecommons.org/licenses/by-sa/4.0/deed.zh
sourceRetrieved: 2026-11-07
sourceChanges: 删除了全部图片、公式、引用角标、信息框、表格标题与“外部链接”小节；正文文字未改动。
---

**PostScript字体**是由[Adobe Systems](/credits/maker/adobe-systems)为专业数字排版开发的轮廓字体规范编码的字体文件。该系统使用PostScript文件格式来编码字体信息。

PostScript字体也可以单独用于指代PostScript系统中作为标准包括的基本字体集，例如Times，Helvetica和Avant Garde。

## 历史 {#历史}

Adobe在1984年的PostScript页面描述语言中定义了Type 1和Type 3字体格式。但在1985年3月支持PostScript的激光打印机Apple LaserWriter面世，它才真正流行起来。在当时，轮廓字体只在打印机中使用，屏幕上依旧用位图字体（bitmap fonts）。

尽管在最初，Type 1字体是作为PostScript的一部分出现的，其所采用的一组绘制操作要比普通的PostScript简单（和PDF相类似，循环和变量等编程特性被移除了），但是增加了渲染提示（hints）以提升低分辨率渲染效果。开始的时候，Adobe并没有公开渲染提示方案的细节，用一种简单的加密方案将Type 1轮廓数据和渲染提示保护了起来，加密也延续至今（尽管加密方案和密钥早已被Adobe公开）。但这一加密方案很快被业界同行的反向工程所破解。虽然如此，Adobe仍要求Type 1字体技术的使用者需要许可证授权。许可证的要价在当时看来是颇高的，Adobe的坚守让价格居高不下。正因如此，苹果公司于1991年决定开发自己的[TrueType](/docs/truetype)格式。TrueType一经发布，Adobe就公开了Type 1字体格式的定义和说明。

Type 3字体支持PostScript语言的全部特性，但是没有标准的渲染提示实现，也没有加密方案。而Type 2字体成为了现代[OpenType](/docs/opentype)字体格式的基础之一。

## 技术 {#技术}

字形（glyph）通过PostScript（PS）语言用三阶贝塞尔曲线（[TrueType](/docs/truetype)使用二阶贝塞尔曲线）描述，字形因此可以通过简单的数学变换调整大小，然后被送到PostScript打印机中。因为Type 1数据描述的是字形的轮廓而不是栅格化的图像（即位图），Type 1字体通常被称为“轮廓字体”，以和位图字体（bitmap fonts）相对比。为了满足需要在屏幕上预览字体的用户，利用渲染提示（hints）和抗锯齿技术可以让文字显示效果变得平滑易认。有时也会加入相同字体的位图版本优化屏幕显示。Adobe Type Manager实用程序可以显示Type 1字体。

## 字体类型 {#字型类型}

### Type 0 {#Type_0}

根据《PostScript语言参考手册》（第二版），Type 0 是一个“复合”字体格式。主要用于OCF字体（如下述）。

### Type 1 {#Type_1}

Type 1（也称为 PostScript Type 1、PS1、T1 或 Adobe Type 1）是用于 Adobe Type Manager 软件和 PostScript 打印机的单字节数码字体格式，支持渲染提示信息。最初为 Adobe 的专有规范，但后来 Adobe 将其公开。Mac OS X 和 Windows 2000 及更高版本通过 GDI API 原生支持 Type 1 字体。（但 Windows GDI+、WPF 或 DirectWrite API 不支持）

Adobe已于2021年1月27日宣布将在2023年1月之后终止对Adobe产品中Type 1 字体的支持 。Photoshop 中对 Type 1 字体的支持也于 2021 年结束。

### Type 2 {#Type_2}

Type 2的本质是一个字符串格式，用于在轮廓字体文件中对字符描述过程进行更为紧凑的表现形式，目的是用在紧凑字体格式（CFF，Compact Font Format）中。它通过使用多参数的运算符、各种预定义的默认值、更有效的编码值分配、字体间（一个字体家族内）共享子例程，它相较于Type 1可以占用更小的空间。 CFF/Type2 格式是 Type 1 OpenType 字体的基础，所以所谓的PostScript或Type 1风格[OpenType](/docs/opentype)字体，亦称为OpenType CFF，在CFF表中写入了字形轮廓和渲染提示。从PDF 文件 1.2 开始，CFF 字体可以嵌入PDF文档。

### Type 3 {#Type_3}

Type 3 字体（也称为 PostScript Type 3 或 PS3、T3 或 Adobe Type 3）内含字形使用 PostScript 语言完整定义，而不是子集。 因此，Type 3 字体可以实现一些 Type 1 字体无法实现的效果，例如指定阴影、颜色和填充图案。 但它不支持渲染提示。Adobe Type Manager 也不支持 Type 3 字体，并且没有一个版本的 Mac OS 或 Windows 将其作为所见即所得字体进行支持。

### Type 4 {#Type_4}

Type 4 格式用于制作打印机字体盒的字体以及永久存储在打印机硬盘上的字体，字符描述以 Type 1 格式表示。Adobe 对这此专有格式没有公开文档。

### Type 5 {#Type_5}

Type 5 类似于 Type 4 格式，用于存储在 PostScript 打印机 ROM 中的字体，也被称为 CROM（Compressed ROM）字体。

### Type 14 {#Type_14}

Type 14，即变色龙字体格式（Chameleon font format），用于在打印机ROM等少量存储空间中能显示大量字体。其核心集由一个主字体（Master Font）和一组字体描述符组成，这些描述符用来指定如何调整主字体以提供特定字体所需的字符形状。Adobe没有公开Type 14 格式的文档。 它于 1997 年随 PostScript 3 一起推出，后来随着存储成本的降低而不再受到重视。

### Type 32 {#Type_32}

Type 32 用于将位图字体下载到版本号为 2016 或更高版本的 PostScript 解释器。位图字符直接传输到解释器的字体缓存中，由此节省打印机内存空间。

### Type 42 {#Type_42}

Type 42 字体格式是针对TrueType字体的一个包装器（wrapper），通过在PostScript的打印机中加入TrueType光栅化器（在 PostScript 解释器版本 2010，最初只是选配功能，后来成为标准配备）让其可以打印 TrueType 字体。 PostScript的2015版中添加了对多字节中日韩TrueType字体的支持。之所以不按顺序突然选用数字 42，据说是引用了《银河系漫游指南》中的玩笑。

## 文件格式 {#文件格式}

### OCF {#OCF}

OCF 即Original Composite Font，是支持双字节文种（比如中文、日文）的字体格式之一，这也是最早能支持东亚文字的 PostScript 字体。由于 Type 1 仅支持单字节（256字），所以 OCF 通过将多个 Type 1 字体数据按照一定形式连接起来封装成一个字体，用来支持双字节（最多可存放65,536字），其轮廓信息表现方式和 Type1 字体相同一样。由于一个字体要四个文件，所谓“复合”（composite）构造很复杂，不能用于 Mac OS X，栅格化费时、不能被轮廓化，也不能嵌入 PDF 文件。

### CID字体 {#CID字型}

**CID键字体**（亦称CID字体、CID基础字体，CID-keyed font, CID font, CID-based font；其中CID是Character Identifier Font的缩写，即“字符标识符字体”）原本是为PostScript开发的字体格式，设计用于制作字形数量庞大的字体。CID字体开发用于支持东亚文字集。支持异体字、可以PDF嵌入，也可包含字偶距信息。先对各个文种的字形赋予 CID 编号，再映射到各个文种的编码，这个映射关系存储在CMap（Character Map）数据文件中。一个字体文件里可以有多个CMap的映射，因此支持“字形与码位”之间一对多、多对一的复杂关系。具体分为sfn-CID 和 Naked-CID两种。与CID等同的结构被 [TrueType](/docs/truetype)、[OpenType](/docs/opentype)继承下来，但改称为GID（Glyph ID）。

### CFF {#CFF}

**紧凑字体格式**（Compact Font Format，亦称为Type 2字体格式，或CFF/Type2字体格式）是使用了Type 2字符串、对Type 1无损压缩的一种字体格式。通过使用多参数的运算符、各种预定义的默认值、更有效的编码值分配、字体间（一个字体家族内）共享子例程，它相较于Type 1可以占用更小的空间。Type 1字体可以无损地转换为CFF/Type 2字体，反之亦然。
