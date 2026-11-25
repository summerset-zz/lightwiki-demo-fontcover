---
title: 文字光栅化
keywords: ClearType, 次像素, subpixel, 抗锯齿, antialiasing, 光栅化, rasterization, hinting, HiDPI, 字体渲染, 屏幕渲染, 彩边
description: 轮廓怎么变成屏幕上的像素，灰度抗锯齿和 ClearType 差在哪，以及为什么高分辨率屏幕让这件事变得不那么重要了。
section: basics
order: 4
updated: 2026-11-07
draft: false
---

字体文件里存的是**轮廓**，屏幕上是**像素格**。中间那一步叫光栅化，它决定了同一款字体在不同机器上为什么长得不完全一样。

## 轮廓不是像素 {#pipeline}

轮廓是贝塞尔曲线（见 [字形与 em 方框](/)glyph-outline-and-em)），跟“一个像素”没有关系。光栅化要做的是：把曲线按当前字号、屏幕 DPI、系统缩放映射到一张像素网格上，再决定**每个格子要多黑**。

三个只在光栅化阶段才存在的量：

- **网格有多大**：12px 的正文在 2 倍屏上是 24×24 个设备像素，在 1 倍屏上是 12×12；
- **边缘落在格子哪里**：同一根竖干，落在一格的中间还是跨在两格之间，结果完全不同；
- **每个格子被覆盖了多少**：这就是抗锯齿要处理的东西。

<figure style="margin: 2rem 0">
  <svg viewBox="0 0 640 320" role="img" aria-label="同一根字干在三种抗锯齿方式下的像素结果" style="display: block; width: 100%; max-width: 40rem; height: auto; color: var(--color-neutral-800); font-family: system-ui, sans-serif">
    <g font-size="11" fill="currentColor" text-anchor="end">
      <text x="150" y="104">无抗锯齿</text>
      <text x="150" y="184">灰度抗锯齿</text>
      <text x="150" y="264">次像素抗锯齿</text>
    </g>
    <rect x="170" y="72" width="60" height="56" fill="currentColor" />
    <rect x="230" y="72" width="60" height="56" fill="currentColor" />
    <rect x="170" y="152" width="60" height="56" fill="currentColor" />
    <rect x="230" y="152" width="60" height="56" fill="currentColor" fill-opacity=".62" />
    <rect x="170" y="232" width="20" height="56" fill="#ff2d2d" />
    <rect x="190" y="232" width="20" height="56" fill="#2dff2d" />
    <rect x="210" y="232" width="20" height="56" fill="#2d2dff" />
    <rect x="230" y="232" width="20" height="56" fill="#ff2d2d" />
    <rect x="250" y="232" width="20" height="56" fill="#2dff2d" fill-opacity=".86" />
    <g stroke="currentColor" stroke-width="1" fill="none" opacity=".28">
      <rect x="170" y="72" width="180" height="56" />
      <rect x="170" y="152" width="180" height="56" />
      <rect x="170" y="232" width="180" height="56" />
      <line x1="230" y1="72" x2="230" y2="128" /><line x1="290" y1="72" x2="290" y2="128" />
      <line x1="230" y1="152" x2="230" y2="208" /><line x1="290" y1="152" x2="290" y2="208" />
      <line x1="230" y1="232" x2="230" y2="288" /><line x1="290" y1="232" x2="290" y2="288" />
      <line x1="190" y1="232" x2="190" y2="288" /><line x1="210" y1="232" x2="210" y2="288" />
      <line x1="250" y1="232" x2="250" y2="288" /><line x1="270" y1="232" x2="270" y2="288" />
    </g>
    <g font-size="10" fill="currentColor" opacity=".65">
      <text x="380" y="104">边缘是硬的，放大能数出台阶</text>
      <text x="380" y="184">边缘像素整体变灰：覆盖 62%</text>
      <text x="380" y="264">只点亮需要的子像素</text>
      <text x="380" y="278">位置准到 1/3 像素，代价是彩纹</text>
    </g>
    <g font-size="10" fill="currentColor" opacity=".5">
      <text x="170" y="304">一像素一格</text>
      <text x="380" y="304">第三行：一个像素 = R + G + B 三条</text>
    </g>
  </svg>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; line-height: 1.6; color: var(--color-neutral-500)">
    <strong>示意，不是渲染结果</strong>：真实屏幕的子像素比这细得多，强度也经过 gamma 校正；这张图只说明机理。
    第三行的红 / 绿 / 蓝代表<strong>子像素通道</strong>，不是装饰色。同一根字干盖住第二格 62%，三种画法给出了三种不同的边缘。
  </figcaption>
</figure>

## 抗锯齿：让边缘像素取部分覆盖率 {#anti-aliasing}

如果一个像素只有“全黑”和“全白”两种状态，斜线和曲线就会变成台阶。抗锯齿的做法是让边缘像素取**部分不透明度**：一个格子被轮廓盖住 62%，就把它画成 62% 的黑。正常观看距离下，人眼会把这条灰阶平均回一条平滑的边缘。

这叫**灰度**抗锯齿：R、G、B 三个通道一起变，得到的是灰色。

## 次像素：把每个像素拆成三个 {#subpixel}

液晶屏的一个“像素”其实是并排的三个子像素：红、绿、蓝。它们各自发光，所以可以只点亮其中一两条，边缘的落点于是有了**三分之一像素**的精度，等效水平分辨率 ×3。

ClearType 就是 Windows 上这么做的实现（macOS 早期叫 subpixel antialiasing）。代价：

- 只在**知道子像素排列**的屏幕上成立（RGB 还是 BGR、竖排还是横排、有没有倾斜，各家屏幕不同）；
- 关掉它、或系统认为屏幕不匹配时，退回灰度抗锯齿；
- 边缘会带明显的**彩纹**，正常距离看不出来，放大就一览无余；
- 缩放不是 100% 时，子像素与 CSS 像素对不上，Windows 常常直接退回灰度。

<figure style="margin: 2rem 0">
  <div style="display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 0.5rem 0.75rem; align-items: center; font-size: 0.8125rem; line-height: 1.4; color: var(--color-neutral-500)">
    <span>灰度抗锯齿</span>
    <a href="/img/cleartype-grayscale.png" target="_blank" rel="noopener" style="display: block; width: fit-content"><img src="/img/cleartype-grayscale.png" alt="同一句话用灰度抗锯齿渲染：边缘只有深浅不同的灰" width="150" height="27" style="display: block; width: 300px; max-width: 100%; border: 1px solid var(--color-neutral-200); border-radius: 4px; image-rendering: pixelated"></a>
    <span>次像素（ClearType）</span>
    <a href="/img/cleartype-subpixel.png" target="_blank" rel="noopener" style="display: block; width: fit-content"><img src="/img/cleartype-subpixel.png" alt="同一句话用 ClearType 渲染：左侧边缘偏青，右侧边缘偏橙" width="150" height="27" style="display: block; width: 300px; max-width: 100%; border: 1px solid var(--color-neutral-200); border-radius: 4px; image-rendering: pixelated"></a>
  </div>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; line-height: 1.6; color: var(--color-neutral-500)">
    <strong>真实渲染，不是模拟</strong>：Segoe UI Bold、30px，在 Windows 上分别用灰度抗锯齿和 ClearType 各画一次，<strong>没有任何后期处理</strong>。
    页面上按 2 倍显示（不平滑放大，否则 1px 的彩边会被抹平）；原图只有 150 × 27，点开可以接着往里放大看像素。
    彩边的方向取决于屏幕的子像素排列：这张是 RGB，左边缘偏青、右边缘偏橙；换成 BGR 排列的屏，左右会互换，所以“ClearType 的彩边是什么颜色”没有唯一答案。
  </figcaption>
</figure>

这两张图刻意保持白底：暗色主题下我们不给它们反色，因为反色会把青橙对调，等于把要说明的东西说反了。

## 各家的实现 {#implementations}

<!-- source: en.wikipedia.org | Subpixel rendering | 1379704885 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | 摘译 Implementations 一节；只保留 ClearType / FreeType / CoolType / Quartz 四条，删去 Apple II 的历史考据 -->

同一个次像素原理，各平台的实现差得很远：

| 实现 | 归属 | 时间线 |
| --- | --- | --- |
| ClearType | 微软 | 1998 年 COMDEX 公布，2000 年发论文；Windows XP 提供，Vista 起默认开启 |
| FreeType | 开源库 | Linux 与其他 Unix 系桌面软件基本都走它 |
| CoolType | Adobe | 用在 Reader 一系产品里 |
| Quartz | 苹果 | 自己的次像素实现，后来整体取消，改回灰度抗锯齿 |

表里最后一条是理解“同一个字体在 Mac 上看起来更细”的关键：不是字体不同，是渲染路径不同。

## 微调在各平台的命运 {#hinting}

<!-- source: en.wikipedia.org | Font hinting | 1305053204 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | 摘译：只保留两种微调方式与各平台的取舍 -->

微调（hinting）是让字形在低分辨率网格上“对齐到像素”的指令，有两套做法：

- **TrueType 指令**：字体里带一小段程序，由渲染器执行；精细，但写起来成本高，也容易在不同引擎上表现不一；
- **自动微调**（auto-hinter）：渲染器自己分析轮廓，不需要字体配合；FreeType 的 auto-hinter 是典型。

平台态度也分两派：Windows 一直重视微调（高 DPI 普及之前全靠它保住小字清晰），苹果的选择是不用微调、只做抗锯齿 —— 形状更忠于设计，小字则更依赖高分屏。

所以“同一字体在不同系统上形状略有出入”有第二个来源：不只是次像素，微调的有无也会改变笔画落在哪个像素上。

## 为什么今天没那么重要了 {#today}

- **HiDPI**：手机、笔记本普遍 2–3 倍屏。1 个 CSS px 对应 2–3 个设备像素，一个边缘像素本来就小了三分之二，“再抢回三分之一像素”的收益随之变小；
- **macOS 从 Mojave（10.14）起关掉了次像素抗锯齿**，回到灰度抗锯齿，理由是高分辨率下它已不划算，而彩边与字形设计相冲；
- Windows 保留 ClearType，但在非整数缩放、平板模式、某些驱动下会失效；
- 网页字体常常不带 hinting 指令，小字号下笔画的落点规则也跟着变（见 [hinting](/)glyph-outline-and-em#hinting)）。

## 所以“两个平台看起来不一样”是正常的 {#why-different}

同一款字体、同一句话、同样的字号，在 Windows / macOS / 手机上占的宽度可以差几个像素，换行位置随之改变。原因不在字体，就在上面这几步：网格大小、抗锯齿方式、hinting、度量的舍入方式。

这也是为什么设计稿和实现在中文小字号上“总差半行”。

## 前端能控制什么 {#css}

几乎什么都不能。常被当成“开关”的几样东西，实际效果是这样：

| 写的东西 | 真实效果 |
| --- | --- |
| `-webkit-font-smoothing: antialiased` | **只对 macOS 上的 Safari / Chrome 有效**（关掉次像素渲染），Windows 上不做任何事 |
| `-moz-osx-font-smoothing: grayscale` | 同上，Firefox 的 macOS 版本 |
| `font-smooth` | 非标准，各实现不一致，不要依赖 |
| `text-rendering: optimizeLegibility` | 与抗锯齿无关，它管连字与字偶距（见 [合成与杂项](/)css-text-misc)） |

真正能改善观感的还是老办法：字号别选 11px 这种临界值、图表用足够的尺寸、以及选一款在小字号下设计得清楚的字体。

## 本站为什么不“模拟”ClearType {#not-simulated}

本站的样例图是**用字体自己的轮廓画的 SVG**。它展示的是字形的形状，不是某个系统把它渲染出来的样子：

- SVG 里没有抗锯齿决策，也没有子像素；它到你的屏幕上还会**再被你自己的系统**光栅化一次；
- 所以本文开头那三行像素**只解释机理**，刻意画得很夸张：它要说明的是“同样的覆盖率可以拆成三种画法”，不是“你的屏幕会这样显示”。

上一节那两张位图是唯一的例外，而它们和“模拟”的区别在**出处**：那是本机系统真渲染出来的结果，用的什么系统、什么模式、什么字号都写清楚了，别人可以复现、可以反驳。

我们不做的，是照着机理**手工合成**一张“Windows 上长这样、macOS 上长那样”的对比图：那种图看着更专业，但每一处像素都是人手摆的，会给出一个不存在的精确度，看的人会以为自己的屏幕上就是这样。

## 检查清单 {#checklist}

- 讨论的是**字形**的问题，还是**渲染**的问题？（前者看轮廓，后者看系统设置与缩放）
- 这个字号在目标屏幕上占几个设备像素？
- 是不是在拿一张放大的截图当“正常观感”？（放大只用来解释机理）
- 换个平台或缩放，这段文字会不会重排？重排了该怪谁？

## 延伸阅读

- Microsoft：ClearType 与 DirectWrite 的抗锯齿说明
- Apple：macOS Mojave 移除次像素抗锯齿的说明
- 本站：[字形与 em 方框](/)glyph-outline-and-em)、[度量图怎么读](/)how-to-read-metrics)
