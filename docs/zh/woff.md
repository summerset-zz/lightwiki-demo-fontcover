---
title: Web 字体格式
description: 网页上实际传输的字体格式：把 TTF / OTF 压缩一层再套个壳，WOFF 2.0 用 Brotli。
keywords: WOFF, WOFF2, 网页字体, web font, 压缩, Brotli, zlib
section: basics
order: 8
updated: 2026-11-07
sourceSite: zh.wikipedia.org
sourceTitle: Web開放字型格式
sourceRevid: 94619899
sourceUrl: https://zh.wikipedia.org/w/index.php?oldid=94619899
sourceLicense: Creative Commons Attribution-Share Alike 4.0
sourceLicenseUrl: https://creativecommons.org/licenses/by-sa/4.0/deed.zh
sourceRetrieved: 2026-11-07
sourceChanges: 删除了全部图片、公式、引用角标、信息框、表格标题与“外部链接”小节；正文文字未改动。
---

**Web开放字体格式**（Web Open Font Format，简称**WOFF**）是一种网页所采用的字体格式标准。此字体格式发展于2009年，由万维网联盟的Web字体工作小组标准化，现在已经是推荐标准。此字体格式不但能够有效利用压缩来减少文件大小，并且不包含加密也不受DRM（数字著作权管理）限制。

在2010年4月8日，Mozilla基金会、Opera软件公司和[微软](/credits/maker/microsoft)提交WOFF之后，万维网联盟发表评论指，希望WOFF不久能成为所有浏览器都支持的、“单一、可互操作的（字体）格式”。2010年7月27日，万维网联盟将WOFF作为工作草案发布。2018年3月发布2.0版。

## 规格 {#规格}

WOFF本质上是包含了基于SFNT的字体（如[TrueType](/docs/truetype)、[OpenType](/docs/opentype)或其他开放字体格式），且这些字体均经过WOFF的编码工具压缩，以便嵌入网页中。WOFF 1.0使用zlib压缩，文件大小一般比TTF小40%。而WOFF 2.0使用Brotli压缩，文件大小比上一版小28%～29%。

W3C于2024年8月8日发布WOFF 2.0推荐标准的修订版；规范将`font/woff2`登记为此格式的媒体类型。

## 支持 {#支持}

以下浏览器支持 WOFF：

-   Mozilla Firefox3.6版。
-   Google Chrome则自6.0起就支持WOFF。
-   微软自第三个platform review版本的Internet Explorer 9起，就对WOFF添加了全部的支持。
-   Konqueror since KDE 4.4.1。
-   Presto自2.7.81起支持WOFF。
-   WebKit浏览器支持WOFF，Safari自5.1起支持WOFF。

以下浏览器支持 WOFF 2.0：

-   Google Chrome（自36版本起）
-   Edge（自14版本起）
-   Opera（自26版本起）
-   Firefox（自35版本起）
-   Safari（自10版本起）
