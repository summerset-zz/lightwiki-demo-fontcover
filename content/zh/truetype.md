---
title: TrueType
description: 苹果在 1980 年代末做出来的轮廓格式，用二次贝塞尔曲线，至今仍是 Windows 与 macOS 的默认。
keywords: TrueType, TTF, 二次贝塞尔, 微调, hinting, 字体格式, truetype
section: basics
order: 6
updated: 2026-11-07
sourceSite: zh.wikipedia.org
sourceTitle: TrueType
sourceRevid: 91945555
sourceUrl: https://zh.wikipedia.org/w/index.php?oldid=91945555
sourceLicense: Creative Commons Attribution-Share Alike 4.0
sourceLicenseUrl: https://creativecommons.org/licenses/by-sa/4.0/deed.zh
sourceRetrieved: 2026-11-07
sourceChanges: 删除了全部图片、公式、引用角标、信息框、表格标题与“参见 / 外部链接”类收尾小节；正文文字未改动。
---

**TrueType**是由美国苹果公司和微软公司共同开发的一种电脑轮廓字体（曲线描边字）类型标准。这种类型字体文件的扩展名是`.ttf`，类型代码是`tfil`。

早在1980年代末，苹果公司为了对抗[Adobe](/credits/maker/adobe-systems)公司的[Type 1](/docs/postscript-fonts#Type_1) PostScript字体，设计开发了TrueType。之后微软加入了开发，Windows操作系统的字体格式基本上都统一成TrueType，而在苹果的Mac OS却成了PostScript和TrueType对立的局面。TrueType后来也被Linux等系统使用，成为标准字体。TrueType的主要强项在于它能给开发者提供关于字体显示、不同字体大小的像素级显示等的高级控制。

在后来开发的[OpenType](/docs/opentype)类型字体中，可以选择PostScript或TrueType作为记述方式。

## 历史 {#历史}

### 苹果 {#苹果}

在麦金塔中，字体原先是存储为手工调整的点阵字体文件，为每个字体、特殊大小分别指定一个个的像素位置。如果用户要看另一个大小的字体，字体管理器（Font Manager）找到最接近匹配，应用基本比例算法来显示。当比例放大到大字号的时候，效果就非常糟糕——因为字体是点阵式的，字形就被放大成马赛克式的锯齿。

与之相对的，打印机的字体，如著名的Apple LaserWriter是基于[PostScript Type 1](/docs/postscript-fonts#Type_1)轮廓，可以出色地输出任何大小的文字。轮廓字体通过一套描绘曲线的算式来创建每个字符或“字形”。使用算式，计算机可以绘制出一个“轮廓”形状，然后再“填充”进颜色（例如：黑色）从而打印出字符。这些算式可以按照比例进行缩放到任意大小，而与显示器和打印机的分辨率无关。无论是打印到胶片，还是显示在屏幕上都具有同样的质量。该技术曾经是一个重要的发明，并由Adobe公司创始人开发推行，称为PostScript。但另一个难点是Type 1字体是加密过的，Adobe通过发售格式认证得到了相当可观的收入，所以他们也不想向苹果免费转让这个软件。

而苹果的Sampo Kaasila决定制作一个全新的格式，代号为“Bass”。这个系统随后被开发出来，称为TrueType，并在1991年5月随Mac OS System 7发表。这些字体均含有4种字型的套装，包括*Times Roman*, *Helvetica*, *Courier*等大量字体，代替了原麦金塔系统中原有的点阵字体。为了能保证和老系统的兼容，苹果还发布了一个TrueType扩展，和一个System Software 6使用的Font/DA Mover。

可是TrueType字型在实际的出版业界反应并不好。当时的状况是，用户已经花了大笔资金购买了Type 1字体，没有必要进行更换，而且他们仍然要使用Adobe Type Manager (ATM)。而且另外一个问题是，TrueType格式的字体数量甚少，不值得他们更新。

为了对抗Adobe，苹果将TrueType认证给了微软，并换来了TrueImage——微软开发的PostScript打印机控制语言，苹果计划使用在他们的激光打印机上。不过这个打印语言最终没有在任何苹果的产品上实际使用。

尽管ATM并不是随操作系统附，而需要另外购买，但是它已经成为桌面出版业界的实际标准。当TrueType发布的时候，Adobe的约翰·沃诺克发表声明，声称苹果和微软在兜售“骗人的万灵油”，并随后发布了可供任何人使用的Type 1格式作为出版标准。这给TrueType更大的压力。苹果于是更新了Adobe的协议，在其打印机上使用PostScript。

苹果在1994年发表了TrueType GX拓展了TrueType，也是QuickDraw GX智能字体技术的一部分。这是在两个主要领域的重要拓展：首先在字体轴线（morphing变形），比如允许字体从细到粗、或从窄到宽平滑调整，与Adobe的“multiple master”技术对抗。第二就是自动替换，当字符组合为事先设计好的变体设计时可以进行自动替换，最常见的就是合字组合：“fi”“ffi”“ct”等等。但是，由于缺乏用户友好的开发工具来创建TrueType GX字体，使得GX fonts字体寥寥。TrueType GX中的多数技术，包括morphing变形和替换，现在都被囊括到Mac OS X系统的苹果高级文字排版技术（Apple Advanced Typography，AAT）中。然而苹果以外的字体开发者却很少创建AAT字体，而都转向支持[OpenType](/docs/opentype)。

### 微软 {#微软}

1991年微软把TrueType加入Windows 3.1操作系统。在与[Monotype](/credits/maker/monotype-imaging)公司合作下，微软花了大力气制作了一批高质量TrueType字体，并使其可以与当时PostScript设备捆绑的核心字体兼容。其中包括了目前Windows系统的一些著名字体：Times New Roman体（与Times Roman兼容）、Arial体（与Helvetica体兼容）和Courier New体（与Courier体兼容）。

请注意，所谓“兼容”意味着两层含义：第一，相兼容字体外观非常相似；第二，也是很重要的，字体含有同样的字符宽度，以便可以用来替代相同文档的内容而不需要重新排版调整。对于字体名称的变化，除了Arial和Helvetica体；导致有人认为产生一个问题：每当一个特定的Windows字体命名之后，必须决定一个与其相当的苹果或PostScript字体，反之亦然。尽管如此，虽然字体中字符轮廓数据本身不一样，风格和字型被做的很相似，导致一般用户很难区别开来。

微软和Monotype的技术人员使用TrueType的“提示技术”（hinting technology）来解决字体在低分辨率的显示模糊问题。原先的技术是在小字号时改用点阵字体。后来的技术改进首先引入了抗锯齿效果，可以平滑字体边缘；现在常用的是“次像素补偿”（微软使用这个技术，并称为ClearType），使用液晶显示器像素结构，以提高实际能显示的分辨率。微软大力推广这些技术，并扩展到各种平台。

微软还开发了一个叫“智能字体”的技术，在1994年称为*TrueType Open*，然后在与Adobe Type 1技术合并后改名为[OpenType](/docs/opentype)。

TrueType Collections (TTC)允许将多个字体合并为一个文件，为选择的字体仅使用一些字体的不同字形创建替换间距保存。最初只在中文、日文和韩国语版的Windows系统中使用，之后在Windows 2000支持所有区域。

## TrueType现状 {#TrueType现状}

### Macintosh和Windows {#Macintosh和Windows}

在目前的Mac OS X和Windows XP系统中，TrueType是最常见的字体格式。虽然二者都包含对Adobe的Type 1格式和[OpenType](/docs/opentype)拓展的本地支持。可是现在很多字体已经改用OpenType格式，但是大多数免费廉价的第三方字体仍使用纯TrueType格式。

目前的趋势是，对屏幕补偿的追求减少了对拓展TrueType字体微调技术（font hinting）的重要性。苹果Mac OS X的补偿技术几乎忽略了所有TrueType字体中的所有微调资料，而微软的ClearType也忽略了很多微调资料，并与“略加微调”的字体配合使用最佳。

### Linux及其他平台 {#Linux及其他平台}

文泉驿计划提供了很好的TrueType中文字符支持，而且开源提供，被很多Linux版本支持。 David Turner的FreeType项目期望创建一个独立执行的TrueType标准（如同Freetype 2其他字体标准）。FreeType包含很多Linux提供者。

在FreeType中有一些专利问题因为一部分TrueType字体微调虚拟机是苹果的专利保护的，并没有在TrueType标准中提及。FreeType 2包括一个自动微调器可以分析字形形状，并自动生成微调，从而跳过这些受专利保护的技术。 免费／廉价字体往往没有微调数据，或者任意生成，自动微调器基本上改进了这类字体的外观，但它同时降低了那些原先微调好的专业字体外观，但是对于非西文字体的效果不是很好，因此很多人还是倾向于使用专利保护的微调技术。

## 技术信息 {#技术信息}

### 轮廓 {#轮廓}

TrueType字体中的字符（或字形）轮廓由直线和二次贝塞尔曲线（bézier）片段构成。这些构建在数学上比平面设计界PostScript使用的三次贝塞尔曲线（也被Type 1字体所使用）更容易处理。尽管如此，对于多数形状，二次要比三次贝塞尔曲线需要更多的点来描述。这个差异也意味着它不能将Type 1无损地转换为TrueType格式，可是你可以无损地将TrueType转换为Type 1。

### 微调语言 {#微調语言}

TrueType系统包含一个虚拟机在字体内部执行程序，处理字形的"提示"（hints）。这些定义轮廓的控制点最主要目的是在字型显示时减少模糊现象。每个字形的微调程序能算出显示字形的像素大小，以及显示环境中其他次要参数。

虽然和普通程序中的接受输入和产品输出一同，TrueType微调语言的确具备一些程序语言的特性：条件分支（IF声明），控制循环一个时间的算法（FOR- 和WHILE-型声明），变量（虽然这些只是内存中分给字体的一个区域中的简单编号的槽），并将代码封装到函数中。特别结构delta hints是最低级的控制，用来移动一个控制点或一个像素大小。

好的TrueType字形程序技术需要在一个字体中尽可能的使用一次参数定义（例如：字符颈宽、大写字母高度、x字高）。这意味着尽量避免delta结构。这可以帮助字体开发者做一些重要修改（例如：要统一将字符主高改到1-2像素宽的时候）。

制作一个良好提示的TrueType字体需要大量的工作。1990年代以来，大量的添加字体提示的程序被开发出来给用户使用；但是，很多TrueType字体只有一些很不完善的提示，或者只有根据字体编辑器自动提示，导致各种不同结果。
