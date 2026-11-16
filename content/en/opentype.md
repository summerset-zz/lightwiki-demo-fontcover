---
title: OpenType
description: The container Microsoft and Adobe designed so that one format carries either kind of outline, with layout features in GSUB and GPOS.
keywords: OpenType, OTF, CFF, TrueType, 字体格式, 版式特性, opentype
section: basics
order: 5
updated: 2026-11-07
sourceSite: en.wikipedia.org
sourceTitle: OpenType
sourceRevid: 1382890363
sourceUrl: https://en.wikipedia.org/w/index.php?oldid=1382890363
sourceLicense: Creative Commons Attribution-Share Alike 4.0
sourceLicenseUrl: https://creativecommons.org/licenses/by-sa/4.0/deed.en
sourceRetrieved: 2026-11-07
sourceChanges: 删除了全部图片、公式、引用角标、信息框、表格标题与“See also”类收尾小节；正文文字未改动。
---

**OpenType** is a format for scalable computer fonts. Derived from [TrueType](/docs/truetype), it retains TrueType's basic structure but adds many intricate data structures for describing typographic behavior. OpenType is a registered trademark of Microsoft Corporation.

The specification germinated at [Microsoft](/credits/maker/microsoft), with [Adobe Systems](/credits/maker/adobe-systems) also contributing by the time of the public announcement in 1996.

Because of wide availability and typographic flexibility, including provisions for handling the diverse behaviors of all the world's writing systems, OpenType fonts are used commonly on major computer platforms.

## History {#History}

OpenType's origins date to Microsoft's attempt to license Apple's advanced typography technology GX Typography in the early 1990s. Those negotiations failed, motivating Microsoft to forge ahead with its own technology, dubbed "TrueType Open" in 1994. Adobe joined Microsoft in those efforts in 1996, adding support for the glyph outline technology used in its Type 1 fonts.

The joint effort intended to supersede both Apple's TrueType and Adobe's PostScript Type 1 font format, and to create a more expressive system that handles fine typography and the complex behavior of many of the world's writing systems. The two companies combined the underlying technologies of both formats and added new extensions intended to address their limitations. The name OpenType was chosen for the joint technology, which they announced later that year.

### Open Font Format {#Open_Font_Format}

Adobe and Microsoft continued to develop and refine OpenType over the next decade. Then, in late 2005, OpenType began migrating to an open standard under the International Organization for Standardization (ISO) within the MPEG group, which had previously (in 2003) adopted OpenType 1.4 by reference for MPEG-4. Adoption of the new standard reached formal approval in March 2007 as ISO Standard ISO/IEC 14496-22 (MPEG-4 Part 22) called **Open Font Format** (OFF, not to be confused with [Web Open Font Format](/docs/woff)), sometimes referred to as "Open Font Format Specification" (OFFS). The initial standard was technically equivalent to OpenType 1.4 specification, with appropriate language changes for ISO. The second edition of the OFF was published in 2009 (ISO/IEC 14496-22:2009) and was declared "technically equivalent" to the "OpenType font format specification". Since then, OFF and OpenType specifications have been maintained in sync. OFF is a free, publicly available standard.

By 2001 hundreds of OpenType fonts were on the market. Adobe finished converting their entire font library to OpenType toward the end of 2002. As of early 2005, around 10,000 OpenType fonts had become available, with the Adobe library comprising about a third of the total. By 2006, every major font foundry and many minor ones were developing fonts in OpenType format.

### Unicode Variation Sequences {#Unicode_Variation_Sequences}

Unicode version 3.2 (published in 2002) introduced variation selectors as an encoding mechanism to represent particular glyph forms for characters. Unicode did not, however, specify how text renderers should support these sequences. In late 2007, variation sequences for the Adobe-Japan1 collection were registered in the Unicode Ideographic Database, leading to a real need for an OpenType solution. This resulted in development of the `cmap` subtable Format 14, which was introduced in OpenType version 1.5.

### Color fonts {#Color_fonts}

Unicode version 6.0 introduced emoji encoded as characters into Unicode in October 2010. Several companies quickly acted to add support for Unicode emoji in their products. Since Unicode emoji are handled as text, and since color is an essential aspect of the emoji experience, this led to a need to create mechanisms for displaying multicolor glyphs.

Apple, Google and Microsoft independently developed different color-font solutions for use in OS X, iOS, Android and Windows.

-   OpenType and OFF already had support for monochrome bitmap glyph, so Google proposed that OFF be extended to allow for color bitmaps. Apple adopted this approach but declined to participate in extending the ISO standard. As a result, Apple added the `sbix` table to their TrueType format in OS X 10.7, while Google proposed addition of the `CBDT` and `CBLC` tables to OFF.
-   Microsoft adopted a different approach than color bitmaps. Noting existing practice on the Web of layering glyphs of different color on top of one another to create multi-colored elements such as icons, Microsoft proposed a new `COLR` table to map a glyph into a set of glyphs that are layered, and a `CPAL` table to define the colors.
-   Adobe and Mozilla proposed adding a new `SVG` table that can represent multi-color glyphs using Scalable Vector Graphics.

These proposals were all incorporated into the third edition of OFF (ISO/IEC 14496-22:2015). Microsoft added `CBDT`, `CBLC`, `COLR`, `CPAL`, and `SVG` tables to OpenType version 1.7, and the `sbix` table in OpenType version 1.8. Microsoft implemented support for all of the different color formats in Windows 10 version 1607 ("Anniversary Update").

OpenType 1.9 introduced a second version of the `COLR` table that adds additional graphics capabilities. Google originally proposed the enhanced version and jointly developed it with Microsoft. The enhanced graphic capabilities include support for three types of gradients, affine transformations, compositing and blending modes, and custom re-usable components. These enhancements give the `COLR` table all of the graphic capabilities of the `SVG` table except stroking. They also add compositing and blending modes, support for which is considered optional for the `SVG` table (as these are implemented in SVG as filter effects). In addition, the enhancements to the `COLR` table are integrated with OpenType Font Variations, which is not possible with the `SVG` table. The enhanced `COLR` table is supported in the Chromium browser engine as of version 98.

### Collections {#Collections}

Since at least version 1.4, the OpenType specification had supported "TrueType Collections", a feature of the format that allows multiple fonts to be stored in a single file. Such a format is useful for distributing an entire [typeface](/docs/fonts-families-faces) (font family) in just one file.

By combining related fonts into a single file, font tables that are identical can be shared, thereby allowing for more efficient storage. Also, individual fonts have a glyph-count limit of 65,535 glyphs, and a Collection file provides a "gap mode" mechanism for overcoming this limit in a single font file. (Each font within the collection still has the 65,535 limit, however.) A TrueType Collection file would typically have a file extension of ".ttc".

However, the specification only described collection files being used in conjunction with glyphs that are represented as TrueType outlines or as bitmaps. The potential existed to provide the same storage and glyph-count benefits to fonts that use CFF-format glyphs (.otf extension). But the specification did not explicitly allow for that.

In 2014, Adobe announced the creation of OpenType Collections (OTCs), a Collection font file that combines fonts that use CFF-format glyphs. This provided significant storage benefits for CJK fonts that Adobe and Google were jointly developing. For example, the Noto fonts CJK OTC is ~10 MB smaller than the sum of the four separate OTFs of which it is composed. The use of a Collection also allowed for combining a very large number of glyphs into a single file, as would be needed for a pan-CJK font.

Explicit support for Collections with CFF-format glyphs was incorporated into the OpenType specification in version 1.8. To reflect this more-inclusive applicability, the term "OpenType Collection" was adopted, superseding "TrueType Collection".

### Font Variations {#Font_Variations}

On 14 September 2016, Microsoft announced the release of OpenType version 1.8. This announcement was made together with Adobe, Apple, and Google at the ATypI conference in Warsaw. OpenType version 1.8 introduced "OpenType Font Variations", which adds mechanisms that allow a single font to support many design variations. Fonts that use these mechanisms are commonly referred to as "Variable fonts".

OpenType Font Variations re-introduces techniques that were previously developed by Apple in TrueType GX, and by Adobe in Multiple Master fonts. The common idea of these formats is that a single font includes data to describe multiple variations of a glyph outline (sometimes referred to as "masters"), and that at text-display time, the font rasterizer is able to interpolate or "blend" these variations to derive a continuous range of additional outline variations.

The concept of fully parametric fonts had been explored in a more general way by Donald E. Knuth in the METAFONT system, introduced in 1978. That system and its successors were never widely adopted by professional type designers or commercial software systems. TrueType GX and Multiple Master formats, OpenType Font Variations' direct predecessors, were introduced in the 1990s, but were not widely adopted, either. Adobe later abandoned support for the Multiple Master format. By 2016, however, the industry landscape had changed in several respects. In particular, emergence of Web fonts and of mobile devices had created interest in responsive design and in seeking ways to deliver more type variants in a size-efficient format. Also, whereas the 1990s was an era of aggressive competition in font technology, often referred to as "the font wars", OpenType Font Variations was developed in a collaborative manner involving several major vendors.

Font Variations is integrated into OpenType 1.8 in a comprehensive manner, allowing most previously-existing capabilities to be used in combination with variations. In particular, variations are supported for both TrueType or CFF glyph outlines, for TrueType hinting, and also for the OpenType Layout mechanisms. The only parts of OpenType for which variations are not supported but might potentially be useful are the 'SVG ' table for color glyphs, and the MATH table for layout of mathematical formulas. The 'SVG ' table uses embedded XML documents, and no enhancement for variation of graphic elements within the SVG documents has been proposed. However, enhancement to the COLR table in OpenType 1.9 has provided a vector format for color glyphs with support for variations.

OpenType 1.8 made use of tables originally defined by Apple for TrueType GX (the avar, cvar, fvar and gvar tables). It also introduced several new tables, including a new table for version 2 of the CFF format (CFF2), and other new tables or additions to existing tables to integrate variations into other parts of the font format (the HVAR, MVAR, STAT and VVAR tables; additions to the BASE, GDEF and name tables).

## Description {#Description}

OpenType uses the general sfnt structure of a TrueType font, but it adds several smartfont options that enhance the font's typographic and language support capabilities.

The glyph outline data in an OpenType font may be in one of two formats: either TrueType format outlines in a `glyf` table, or Compact Font Format (CFF) outlines in a `CFF␣` table. (The table name "CFF " is four characters long, ending in a space character.) CFF outline data is based on the PostScript language Type 2 font format. However, the OpenType specification (pre-1.8) does not support the use of PostScript outlines in a TrueType Collection font file. After version 1.8, both formats are supported in the renamed "OpenType Collection".

For many purposes, such as layout, it does not matter what the outline data format is, but for some purposes, such as rasterisation, it is significant. The OpenType standard does not specify the outline data format: rather, it accommodates any of several existing standards. Sometimes terms like "OpenType (PostScript flavor)" (= "Type 1 OpenType", "OpenType CFF") or "OpenType (TrueType flavor)" are used to indicate which outline format a particular OpenType font file contains.

OpenType has several distinctive characteristics:

-   Accommodates the Unicode character encoding (as well as others), so that it can support any writing script (or multiple scripts at once).
-   Accommodates up to 65,536 glyphs.
-   Advanced typographic "layout" features which prescribe positioning and replacement of rendered glyphs. Replacement features include ligatures; positioning features include kerning, mark placement, and baseline specification.
-   Cross-platform font files, which can be used without modification on Mac OS, Microsoft Windows and Unix/Linux systems.
-   If no additional glyphs or extensive typographic features are added, OpenType CFF fonts can be considerably smaller than their Type 1 counterparts.

## OpenType support {#OpenType_support}

### Basic Roman support {#Basic_Roman_support}

Virtually all applications and modern operating systems have basic Roman support and work with OpenType fonts just as well as other, older formats. Benefits beyond basic Roman support include extended language support through Unicode, support for complex writing scripts such as Arabic and the Indic languages, and advanced typographic support for Latin script languages such as English.

Windows 3.1 and all subsequent versions of Windows support OpenType TT fonts (.ttf). Windows 2000 and later support OpenType PS fonts (.otf). Adobe Type Manager could add basic Roman support of OpenType PS fonts in Windows 95, 98, or Me.

### Extended language support {#Extended_language_support}

Extended language support via Unicode for both OpenType and TrueType is present in most applications for Microsoft Windows (including Microsoft Office Publisher, most Adobe applications, and Microsoft Office 2003, though not Word 2002), CorelDRAW X3 and newer, and many Mac OS X applications, including Apple's own such as TextEdit, Pages and Keynote. It is also widely supported in free operating systems, such as Linux (e.g. in multiplatform applications like AbiWord, Gnumeric, Calligra Suite, Scribus, OpenOffice.org 3.2 and later versions, etc.).

OpenType support for complex written scripts has so far mainly appeared in Microsoft applications in Microsoft Office, such as Microsoft Word and Microsoft Publisher. Adobe InDesign provides extensive OpenType capability in Japanese but does not directly support Middle Eastern or Indic scripts—though a separate version of InDesign is available that supports Middle Eastern scripts such as Arabic and Hebrew. Undocumented functionality in many Adobe Creative Suite 4 applications, including InDesign, Photoshop and Illustrator, enables Middle Eastern, Indic and other languages, but is not officially supported by Adobe, and requires third-party plug-ins to provide a user interface for the features.

### Advanced typography {#Advanced_typography}

Advanced typographic support for Latin script languages first appeared in Adobe applications such as Adobe InDesign, Adobe Photoshop and Adobe Illustrator. QuarkXPress 6.5 and below were not Unicode compliant. Hence, text in these versions of QuarkXPress that contains anything other than WinANSI or MacRoman characters will not display correctly in an OpenType font (nor in other Unicode font formats, for that matter). However, in QuarkXPress 7, Quark offered support similar to Adobe's. Corel's CorelDRAW introduced support for OpenType typographic features in version X6. Mellel, a Mac OS X-only word processor from Redlers, claims parity in typographic features with InDesign, but also extends the support to right-to-left scripts; so does the Classical Text Editor, a specialized word processor developed at the Austrian Academy of Sciences.

As of 2009, popular word processors for Microsoft Windows did not support advanced OpenType typography features. Advanced typography features are implemented only in high-end desktop publishing software. The text engine from Windows Presentation Foundation, which is a managed code implementation of OpenType, is the first Microsoft Windows API to expose OpenType features to software developers, supporting both OpenType TrueType, and OpenType CFF (Compact Font Format) fonts. It supports advanced typographic features such as ligatures, old-style numerals, swash variants, fractions, superscript and subscript, [small capitalization](/docs/small-caps), glyph substitution, multiple baselines, contextual and stylistic alternate character forms, kerning, line-level justification, ruby characters etc. WPF applications automatically gain support for advanced typography features. OpenType ligatures are accessible in Microsoft Office Word 2010.

Windows 7 introduced DirectWrite, a hardware accelerated native DirectX API for text rendering with support for multi-format text, resolution-independent outline fonts, ClearType, advanced OpenType typography features, full Unicode text, layout and language support and low-level glyph rendering APIs.

On Mac OS X, AAT-supporting applications running on Mac OS X 10.4 and later, including TextEdit and Keynote, get considerable OpenType support. Apple's support for OpenType in Mac OS X 10.4 included most advanced typographic features necessary for Latin script languages, such as [small caps](/docs/small-caps), old-style figures, and various sorts of ligatures, but it did not yet support contextual alternates, positional forms, nor glyph reordering as handled by Microsoft's Uniscribe library on Windows. Thus, Mac OS X 10.4 did not offer support for Arabic or Indic scripts via OpenType (though such scripts are fully supported by existing AAT fonts). Mac OS X 10.5 has improved support for OpenType and supports Arabic OpenType fonts. Gradually, the OpenType typography support has improved on newer Mac OS X versions (e.g., Mac OS X 10.10 can better handle long contextual glyph substitutions).

Bitstream Panorama, a line layout and text composition engine from Bitstream Inc., provides complete OpenType support for compact and standard Asian fonts, Arabic, Hebrew, Indic, Thai and over 50 other worldwide languages. The application supports key OpenType tables required for line layout, such as BASE, glyph definition (GDEF), glyph positioning (GPOS), and glyph substitution (GSUB). Panorama also offers complete support for advanced typography features, such as ligatures, swashes, small caps, ornaments, ordinals, superiors, old style, kerning, fractions, etc.

In free software environments such as Linux, OpenType rendering is provided by the FreeType project, included in free implementations of the X Window System such as X.org. Complex text handling is provided either by pango (calling HarfBuzz) or Qt. The XeTeX and LuaTeX systems allow TeX documents to use OpenType fonts, along with most of their typographic features. Linux version of LibreOffice 4.1 and newer supports many OpenType typography features, because it began to use more sophisticated HarfBuzz text shaping library.

## OpenType Feature File {#OpenType_Feature_File}

As a step in the creation of a font, OpenType font properties (other than the outline) can be defined using human-readable text saved in Adobe's OpenType Feature File format. OpenType Feature Files typically have a name ending in a `.fea` extension. These files can be compiled into the binary font container (`.ttf` or `.otf`) using Adobe Font Development Kit for OpenType (AFDKO), FontLab, FontForge, Glyphs, DTL OTMaster, RoboFont or FontTools.

## Layout tags {#Layout_tags}

OpenType Layout tags are 4-byte character strings that identify the scripts, language systems, features and baselines in an OpenType Layout font. Microsoft's Layout tag registry establishes conventions for naming and using these tags. OpenType features are created by using the tags in creating feature scripts that describe how characters are to be manipulated to make the desired feature. These feature scripts can be created and incorporated into OpenType fonts by advanced font editors such as FontLab Studio, AsiaFont Studio, and FontForge.

Operating system and application support for layout tags varies widely.

### Script tags {#Script_tags}

Script tags identify the scripts (writing systems) represented in an OpenType font. Each tag corresponds to contiguous character code ranges in Unicode. A script tag can consist of 4 or fewer lowercase letters, such as `arab` for the Arabic alphabet, `cyrl` for the Cyrillic script and `latn` for the Latin alphabet. The `math` script tag, added by Microsoft for Cambria Math, has been added to the specification.

### Language system tags {#Language_system_tags}

Language system tags identify the language systems supported in an OpenType font. Examples include `ARA` for Arabic, `ESP` for Spanish, `HYE` for Armenian, etc. In general, the codes are not the same as ISO 639-2 codes.

These tags can be used to select local variants of letters that share a single Unicode code point. For instance, the Serbian and Macedonian Cyrillic alphabet has some language-specific glyphs for certain letters, which are only preferred and are not strictly mandated.

### Feature tags {#Feature_tags}

A list of OpenType features with expanded descriptions is given list of typographic features.

### Baseline tags {#Baseline_tags}

Baseline tags have a specific meaning when used in the horizontal writing direction (used in the 'BASE' table's HorizAxis table), vertical writing direction (used in the 'BASE' table's VertAxis table), or both.

| Baseline tag | HorizAxis | VertAxis |
| --- | --- | --- |
| 'hang' | horizontal line from which the syllabograms seem to hang in the Tibetan script | The same line in Tibetan vertical writing mode. |
| 'icfb' | Ideographic character face bottom edge baseline. | Ideographic character face left edge baseline. |
| 'icft' | Ideographic character face top edge baseline. | Ideographic character face right edge baseline. |
| 'ideo' | Ideographic em-box bottom edge baseline. | Ideographic em-box left edge baseline. |
| 'idtp' | Ideographic em-box top edge baseline. | Ideographic em-box right edge baseline. |
| 'math' | The baseline about which mathematical characters are centered. | The baseline about which mathematical characters are centered in vertical writing mode. |
| 'romn' | The baseline used by simple alphabetic scripts such as Latin, Cyrillic and Greek. | The alphabetic baseline for characters rotated 90 degrees clockwise for vertical writing mode. |

### Math {#Math}

A set of tables that mirrors TeX math font metrics relatively closely was added by Microsoft initially to Cambria Math for supporting their new math editing and rendering engine in Office 2007 and later. This extension was added to the ISO standard (ISO/IEC CD 14496-22 3rd edition) in April 2014. Additional (usage) details are available in the Unicode technical report 25 and technical note 28. Some of the new technical features (not present in TeX), such as "cut-ins" (which allows kerning of subscripts and superscripts relative to their bases) and stretch stacks have been patented by Microsoft. Windows 8 supports OpenType math outside MS Office applications via the RichEdit 8.0 component.

Besides Microsoft products, XeTeX and LuaTeX also have some level of support for these tables; support is more limited in XeTeX because it uses the traditional TeX math rendering engine (thus it cannot fully use some of the new features in OpenType math that extend TeX), while LuaTeX takes a more flexible approach by changing some of the internals of TeX's math rendering; in the words of Ulrik Vieth (2009): "More precisely, while XeTeX only provides access to the OpenType parameters as additional \\fontdimens, LuaTeX uses an internal data structure based on the combined set of OpenType and TeX parameters, making it possible to supply missing values which are not supported in either OpenType math fonts or traditional TeX math fonts." In 2013, XeTeX also gained support for cut-ins.

The Gecko rendering engine used by the Firefox web browser also supports some OpenType math features in its MathML implementation.

As of 2024, the set of fonts that supported OpenType math includes: Asana-Math, Cambria Math, DejaVu Math TeX Gyre, Garamond Math, Latin Modern Math, Libertinus Math, Neo Euler, STIX Math, XITS Math, Fira Math, GFS Neohellenic Math, and four TeX Gyre fonts Bonum Math, Pagella Math, Schola Math, Termes Math. More recently the Latin Modern and TeX Gyre fonts (an "LM-ization" of the standard PostScript fonts) have also gained support for OpenType math. As of 2014 the number of OpenType math fonts is still fairly limited. A more up-to-date list is maintained on Mozilla's web site .

### Color {#Color}

Emergence of Unicode emoji created a need for TrueType and OpenType formats to support color glyphs. Apple added a color extension in Mac OS X Lion (and also to iOS 4+). Fonts were extended with colored PNGTooltip Portable Network Graphics images within the sbix table. Google used a similar extension with embedded color bitmap images contained within a pair of tables, the CBDT and CBLC tables. The Google version is implemented in FreeType 2.5.

In Windows 8.1 Microsoft also added color support to fonts, first implemented in the Segoe UI Emoji font. Microsoft's implementation, however, relies entirely on vector graphics: two new OpenType tables were added in Microsoft's implementation: the COLR table allows layered glyphs and the CPAL ("Color Palette") actually defines the colors for the layers. The multi-layer approach allows a backwards compatible implementation as well as varying the rendering depending on the color context surrounding the glyphs. According to Adam Twardoch: "At TypeCon \[2013\], Greg Hitchcock clarified the envisioned roles of the palettes: first palette is used by default for "dark on light" color situations while second palette is intended for use in "light on dark" situations. Additional palettes should be selectable by the user."

Mozilla and Adobe developed a different vector-based extension by adding embedded SVG documents (supporting color but also animations) into the SVG table. The SVG table also allowed for using color palettes defined in the CPAL table. Support was first implemented in Firefox 26.

Adobe, Mozilla, Google and Microsoft each submitted their color extensions for standardization thorough ISO/IEC 14496-22. The new tables for each of these were then added into OpenType version 1.7. Apple's sbix table was originally supported only in AAT fonts, but it was later added into OpenType version 1.8. Microsoft Windows 10 Anniversary Update was the first OS to support all four color font extensions, and Microsoft Edge was the first browser to do so.

In OpenType Version 1.8.3, the specification for the SVG table was revised to be more constrained, providing more clarity for implementations and better interoperability. Apple is supporting the revised specification in Safari 12, iOS 12 and macOS 10.14. The implementation in Microsoft Windows also conforms to this revision.

## SING gaiji solution {#SING_gaiji_solution}

In 2005, Adobe shipped a new technology in their Creative Suite applications bundle that offers a solution for "gaiji" (外字, Japanese for "outside character"). Ideographic writing scripts such as Chinese and Japanese do not have fixed collections of characters. They use thousands of glyphs commonly and tens of thousands less commonly. Not all glyphs ever invented and used in East Asian literature have even been catalogued. A typical font might contain 8,000 to 15,000 of the most commonly used glyphs. From time to time, though, an author needs a glyph not present in the font of choice. Such missing characters are known in Japan as gaiji, and they often disrupt work.

Another aspect of the gaiji problem is that of variant glyphs for certain characters. Often certain characters have been written differently over periods of time. It is not unusual for place names or personal family names to use a historical form of a character. Thus it is possible for an end user using standard fonts to be left unable to spell correctly either their own name or the name of the place where they live.

Several ways to deal with gaiji have been devised. Solutions that treat them as characters usually assign arbitrary Unicode values to them in the Private Use Areas (PUA). Such characters cannot be used outside the environment in which the association of the private Unicode to the glyph shape is known. Documents based on them are not portable. Other installations treat gaiji as graphics. This can be cumbersome because text layout and composition cannot apply to graphics. They cannot be searched for. Often their rendering looks different from surrounding characters because the machinery for rendering graphics usually is different from the machinery for rendering glyphs from fonts.

The SING (Smart INdependent Glyphlets) technology that made its debut with Adobe's Creative Suite 2 allows for the creation of glyphs, each packaged as a standalone font, after a fashion. Such a packaged glyph is called a *glyphlet*. The format, which Adobe has made public, is based on OpenType. The package consists of the glyph outline in TrueType or CFF (PostScript style outlines) form; standard OpenType tables declaring the glyph's metrics and behavior in composition; and metadata, extra information included for identifying the glyphlet, its ownership, and perhaps pronunciation or linguistic categorization. SING glyphlets can be created using Fontlab's SigMaker3 application.

The SING specification states that glyphlets are to travel with the document they are used in. That way documents are portable, leaving no danger of characters in the document that cannot be displayed. Because glyphlets are essentially OpenType fonts, standard font machinery can render them. The SING specification also describes an XML format that includes all the data necessary for reconstituting the glyphlet in binary form. A typical glyphlet might require one to two kilobytes to represent.
