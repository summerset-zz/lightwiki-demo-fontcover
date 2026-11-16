---
title: 书写方向
keywords: 书写方向, 竖排, RTL, 阿拉伯文, 连写, 双向文本, bidi, writing-mode, 蒙古文, 排版引擎
description: 横排还是竖排、从左还是从右、字与字要不要连起来，这是三件不同的事，混在一起说就永远查不清文字为什么坏了。
section: design
order: 7
updated: 2026-11-02
draft: false
---

同一段文字，在不同软件里可能正常、可能变形、也可能直接坏掉。方向是这类故障里最常见的一类，而它其实是三件不同的事。

## 三件事 {#three}

1. **字符顺序**：从左往右（LTR）还是从右往左（RTL）；
2. **行方向**：横排还是竖排；
3. **连写与成形**：相邻的字要不要连起来、要不要按位置换字形。

软件说“不支持阿拉伯文”，多半指第 3 件；说“不支持竖排”，指第 2 件。而在用户眼里症状是一样的：文字看起来不对。

## 从右往左 {#rtl}

阿拉伯文、希伯来文、波斯文、乌尔都文都是从右往左排的。要记住的关键一点：**文本是按逻辑顺序存的**，先打的字在前，只有显示时才反过来。

所以复制、搜索、字符计数都不受影响，受影响的只有**显示**。反过来说，在代码里手工把字符串反转来“模拟 RTL”一定是错的：那段文字一旦被复制走，顺序就错了。

一段里同时有 RTL 和 LTR（阿拉伯文里夹一个英文品牌名、一个数字）时，谁在哪一侧由 Unicode 的双向算法算出。三个反直觉的地方：

- 数字在 RTL 文本里仍按 LTR 排列，只是整块的位置跑到左边或右边；
- 括号、行末的句号在 RTL 段里会**镜像**；
- 一段纯 LTR 的内容（网址、代码）夹在 RTL 里时，紧挨着它的标点归哪一边，经常出人意料。

这些由排版引擎按算法处理，CSS 只给 `direction` 和 `unicode-bidi` 两个开关。

<figure style="margin: 1.75rem 0">
  <div style="display: grid; gap: 0.5rem; font-size: 1.0625rem">
    <div style="display: grid; grid-template-columns: 3.5rem minmax(0, 1fr); gap: 0.75rem; align-items: baseline">
      <span style="font-family: system-ui, sans-serif; font-size: 0.75rem; color: var(--color-neutral-500)">LTR</span>
      <div dir="ltr" style="border: 1px solid var(--color-neutral-200); border-radius: 0.5rem; padding: 0.5rem 0.75rem; color: var(--color-neutral-800)">مرحبا، FontCover (2026).</div>
    </div>
    <div style="display: grid; grid-template-columns: 3.5rem minmax(0, 1fr); gap: 0.75rem; align-items: baseline">
      <span style="font-family: system-ui, sans-serif; font-size: 0.75rem; color: var(--color-neutral-500)">RTL</span>
      <div dir="rtl" style="border: 1px solid var(--color-neutral-200); border-radius: 0.5rem; padding: 0.5rem 0.75rem; color: var(--color-neutral-800)">مرحبا، FontCover (2026).</div>
    </div>
  </div>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; line-height: 1.6; color: var(--color-neutral-500)">
    同一串字符只换了 <code>dir</code>：两段的先后反了，句号也跑到了最左边。但阿拉伯文在两张图里<strong>都是</strong>从右往左读的，<code>dir</code> 只改变基准方向。
  </figcaption>
</figure>

这里容易看偏：两张图里的阿拉伯文都没有“写反”，变的只有**段落的先后**和**标点归谁**。原因是方向其实有两层：

- **段落基准方向**（`dir` / CSS `direction`）：行往哪边对齐、几个方向不同的段谁在前、行末标点贴哪边；
- **字符自身的方向**：由 Unicode 属性定。阿拉伯字母天生是 R 类，不管放在 LTR 还是 RTL 段落里，那一段内部永远从右往左排。

所以 `dir=ltr` 不会把阿拉伯文读反，它只是把阿拉伯文当成一段 RTL 嵌在左边。真正会坏掉的是**段落级**的东西：行末句号、混排时的标点归属、整行对齐。

顺带解释图里那个“看不出变化”的地方：RTL 段里括号会被镜像（`(` 换成 `)` 的字形），而镜像的目的正是让 `(2026)` 在两种方向下看起来都是“左括号在左”。看着没变，是因为它确实被处理过了。

## 连写 {#joining}
<!-- hint: 连写 | 阿拉伯文等文字的字母会按位置改变形态，分为独立、词首、居中、词尾四种，相邻字母需要连接。字体缺少这些字形时，词语会断开。 -->

阿拉伯字母在词首、词中、词尾长得不一样，孤立时又是另一种形态。文本里存的永远是同一个码位，**变形态是排版时做的事**：字体的 GSUB 表里有一组特性专门干这个（`isol` / `init` / `medi` / `fina`），排版引擎按上下文挑字形。

也就是说，“连不上”通常不是字符错了，而是**没人给它挑字形**：要么软件没调成形，要么字体里压根没有这几个特性。细节见 [整形与回退](/docs/unicode-shaping-fallback) 与 [GSUB / GPOS](/docs/gsub-gpos)。

| 位置 | 写法 | 说明 |
| --- | --- | --- |
| 孤立 | ح | 前后都不挨着 |
| 词首 | حـ | 只有右边连着 |
| 词中 | ـحـ | 两边都连着 |
| 词尾 | ـح | 只有左边连着 |

这四格本身就带一个检查：**渲染出来是四种不同的形状，说明这个字体有连写特性**；如果四格看起来是同一个字母加几根横线，那这个字体大概只有孤立形。

## 为什么会连不到一起 {#broken}

按出现频率排：

1. **软件自己排字，没走系统成形**。同一个字母被逐个画出来，于是全是孤立形；
2. **字体里没有这些特性**。用一款只有拉丁字符的字体去渲染阿拉伯文，回退到的那款可能只有孤立形；
3. **它已经不是文字了**。转曲、导出成图形、或者“图像描摹”之后再改，都没有选字形这回事（见 [文字转曲线](/docs/outline-conversion)）；
4. **被拆成了一堆独立对象**。每个字母一个文本框，或者逐字拼出来的 SVG `<text>`，谁也不挨着谁；
5. **经过了截图或 OCR 往返**。像素回来的时候，连写关系已经丢了。

一条最快的判断：**这段内容能不能被选中、复制、搜索？** 不能，它就不是文字，后面关于方向、连写的讨论都不成立。

## 竖排 {#vertical}

中日韩的竖排不是把横排旋转 90 度：

- 标点要换字形（逗号、句号、括号、引号在竖排里有专门的朝向），靠字体的 `vert` / `vrt2` 特性替换；
- 两位数字通常横躺占一个全角宽，CSS 里是 `text-combine-upright`；
- 注音、旁注在竖排里跑到字的右边；
- 拉丁字母竖排时是整体旋转还是逐个正立，是设计决定，对应 `text-orientation`。

字体缺 `vert` 的话，标点会停在横排的位置上，看起来像“歪了”，其实是一次 GSUB 替换没有发生。中文排版里还有别的方向问题，见 [中文排版](/docs/cjk-typography)。

<figure style="margin: 1.75rem 0">
  <div style="display: flex; gap: 1.5rem; align-items: flex-start">
    <div>
      <p style="margin: 0 0 0.375rem; font-family: system-ui, sans-serif; font-size: 0.75rem; color: var(--color-neutral-500)">横排</p>
      <div style="writing-mode: horizontal-tb; border: 1px solid var(--color-neutral-200); border-radius: 0.5rem; padding: 0.625rem 0.75rem; font-size: 1rem; line-height: 1.75; color: var(--color-neutral-800)">标点会转向，数字躺着。</div>
    </div>
    <div>
      <p style="margin: 0 0 0.375rem; font-family: system-ui, sans-serif; font-size: 0.75rem; color: var(--color-neutral-500)">竖排</p>
      <div style="writing-mode: vertical-rl; height: 11rem; border: 1px solid var(--color-neutral-200); border-radius: 0.5rem; padding: 0.75rem 0.625rem; font-size: 1rem; line-height: 1.75; color: var(--color-neutral-800)">标点会转向，数字躺着。</div>
    </div>
  </div>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; line-height: 1.6; color: var(--color-neutral-500)">
    两块的文字完全一样。竖排里逗号和句号挪到了字的右上角，这是字体按 <code>vert</code> 替换的字形，不是旋转出来的。
  </figcaption>
</figure>

## 为什么软件支持参差 {#software}

因为这件事**不在字体里，在排版引擎里**：

- 浏览器（HarfBuzz）对成形、双向、竖排是全的；
- Word 走系统的 DirectWrite，对复杂文字反而是最稳的几款之一；
- InDesign 要有中东语言支持的那个版本才有完整的 RTL；
- 矢量软件里，点文字、区域文字、路径文字常常是几套不同的引擎，换一个工具就换一份毛病。

这也解释了一个在工作室里流传的做法：**先在 Word 里排好、截图、再拿去描摹成矢量**。它绕开的其实是排版引擎不支持，代价是文字从此变成了图像。

## 兜底流程 {#fallback}

如果必须在某个不支持的工具里出图：

1. 在**支持成形**的地方排版（Word、浏览器、带 RTL 支持的 InDesign）；
2. 优先导出 PDF，并确认 PDF 里的文字仍然能被选中，能选中就说明它还是文字；
3. 确实需要曲线，再做转曲，同时把字体名与授权情况记下来（见 [文字转曲线](/docs/outline-conversion)）；
4. 把截图加描摹留到最后：它是唯一一条**信息损失不可逆**的路。

## 检查清单 {#checklist}

- 这段内容能不能选中、复制、搜索？（先判断它还是不是文字）
- 字体里有没有 `init` / `medi` / `fina`（连写）、`vert` / `vrt2`（竖排）？
- `dir` 设的是**段落基准方向**，不是“把文字反过来”，两者不要混。
- RTL 文本是用逻辑顺序存的，还是在代码里被手工反转了？
- 竖排时标点的朝向、数字的姿态对不对？
- 这个软件用的是系统成形，还是自己的文本引擎？
