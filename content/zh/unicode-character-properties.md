---
title: 字符属性
keywords: 字符属性, general category, script, 分解, decomposition, 兼容分解, 数值, numeric, 大小写, 组合类, 双向类, bidi, 镜像, 旧名, 转义
description: 一个码位带的不止是名字。类别、分解、数值、大小写、组合类、双向类、旧名各管什么，以及弹窗里那几行该怎么读。
section: unicode
order: 2
updated: 2026-11-03
draft: false
---

点开一个字符，除了名字，还有一串属性。它们来自 Unicode 的字符数据库（UCD），不是字体里的东西，**同一份属性适用于所有字体**。

## 名字（Name） {#name}

每个已分配码位有一个正式名字，由规范给出，不能改：

- `U+0041` → `LATIN CAPITAL LETTER A`
- `U+4E2D` → `CJK UNIFIED IDEOGRAPH-4E2D`
- `U+1F600` → `GRINNING FACE`

名字是**标识**，不是描述：`GRINNING FACE` 只是这个名字，不代表任何具体长相。

控制字符没有名字（`<control>` 之类是占位），所以本站统计已分配时不算它们，见 [区块与已分配](/)unicode-blocks)。

### 旧名：Unicode 1.0 的叫法 {#old-name}

`UnicodeData.txt` 第 11 列存的是 Unicode 1.0 时代用的名字。1.1 之后改过名的那批字符保留旧名，方便老文本、老代码对上号：

| 码位 | 现在的名字 | 旧名 |
| --- | --- | --- |
| `U+002E` | FULL STOP | PERIOD |
| `U+005C` | REVERSE SOLIDUS | BACKSLASH |
| `U+0028` | LEFT PARENTHESIS | OPENING PARENTHESIS |
| `U+FEFF` | ZERO WIDTH NO-BREAK SPACE | BYTE ORDER MARK |

最后一行值得多看两眼：今天人人叫它 BOM，而在官方表里 BOM 是**旧名**，正式名字是“零宽不换行空格”。

控制字符那一批的旧名（`NULL`、`BELL`、`LINE FEED`）其实是 ISO 6429 的叫法，Unicode 直接沿用了同一套。

## general category：这个字是什么 {#category}
<!-- hint: 类别 | 类别取自 Unicode 字符数据库（UCD），两字母代码就是该字段的取值，中文资料中也不翻译。 -->

两字母代码，分七大类：

| 大类 | 前缀 | 含义 |
| --- | --- | --- |
| 字母 | `L` | Letter |
| 标记 | `M` | Mark（重音、变音符号） |
| 数字 | `N` | Number |
| 标点 | `P` | Punctuation |
| 符号 | `S` | Symbol |
| 分隔符 | `Z` | Separator（空格类） |
| 其它 | `C` | Other（控制、格式、私用、未分配） |

细分的常用几个：

| 代码 | 含义 | 例子 |
| --- | --- | --- |
| `Lu` / `Ll` / `Lt` | 大写 / 小写 / 词首大写字母 | `A` / `a` / `ǅ` |
| `Lo` | 其它字母（汉字、日文假名等） | `中` |
| `Lm` | 修饰字母 | `ʰ` |
| `Mn` | 非间距标记（叠在别的字符上） | 组合重音 |
| `Nd` | 十进制数字 | `7` |
| `Po` | 其它标点 | `!` |
| `Zs` | 空格分隔符 | 半角空格 |
| `Cc` | 控制字符 | 换行 |
| `Cf` | 格式字符（不可见） | 零宽空格 |

弹窗的区块段会给一张**类别分布**：这个区块里有多少字母、多少标点、多少符号。区块里是混的，所以给分布而不给一个假结论。

## script：属于哪种文字 {#script}
<!-- hint: 书写系统 | 书写系统指字符所属的文字体系，例如拉丁文、西里尔文、汉字。它与语言不同，一种文字通常供多种语言使用。 -->

**脚本（Script）** 是这套字符属于哪种书写系统：`Latin`、`Han`、`Hiragana`、`Greek`、`Arabic`……

它与区块不是一回事：汉字分散在多个区块里（基本区、扩展 A–I、兼容区……），而一个区块里可能只有一种脚本。

脚本影响排版：

- 换行规则（中文按字断、泰文按词断）；
- 字体选择（回退链常按脚本挑）；
- `locl` 特性按语言换字形（见 [GSUB / GPOS](/)gsub-gpos)）。

## 分解：同一个字的两种写法 {#decomposition}
<!-- hint: 分解 | 有些字符可以写成基础字符加组合标记。规范分解表示同一个字符的两种写法，兼容分解只是外观相似。 -->

`À` 有两个码位可选：`U+00C0` 一个字符，或者 `U+0041` + `U+0300`（`A` 加一个重音符）。Unicode 用**分解映射**把这类关系记下来，`UnicodeData.txt` 第 6 列就是它。弹窗里分两行显示：

- **分解**：规范分解（canonical），即同一个字的另一种写法；
- **兼容分解**：兼容分解（compatibility）：排版上说得通的另一种写法，但**不是同一个字**。

### 规范分解：真的就是同一个字 {#canonical}

| 字符 | 码位 | 分解成 |
| --- | --- | --- |
| `À` | `U+00C0` | `A` + `◌̀` |
| `Å` | `U+00C5` | `A` + `◌̊` |
| `Ω` | `U+2126`（欧姆符号） | `Ω`（`U+03A9`） |

第三行是这类关系里最容易被漏看的：欧姆符号和希腊字母 Ω 是**同一个字符**，历史上编了两次码，Unicode 用规范分解承认了这一点。

### 兼容分解：看着像，但不是同一个字 {#compatibility}

| 字符 | 码位 | 分解成 | 标签 |
| --- | --- | --- | --- |
| `ﬁ` | `U+FB01` | `f` `i` | `<compat>` |
| `µ` | `U+00B5` | `μ`（希腊字母） | `<compat>` |
| `½` | `U+00BD` | `1` `⁄` `2` | `<fraction>` |
| `①` | `U+2460` | `1` | `<circle>` |
| `㎏` | `U+338F` | `kg` | `<square>` |
| `Ａ` | `U+FF21` | `A` | `<wide>` |


标签回答的是“为什么它不是同一个字”：

| 标签 | 说的是什么 |
| --- | --- |
| `<compat>` | 笼统的兼容变体，没有更细的说法（连字、老式写法） |
| `<fraction>` | 分数排法 |
| `<circle>` `<square>` | 圈起来的、方框里的缩写 |
| `<wide>` `<narrow>` | 全角 / 半角（全角空格 `U+3000` 分解成普通空格） |
| `<super>` `<sub>` | 上标 / 下标 |
| `<small>` | 小型变体 |
| `<noBreak>` | 不可断行的版本（不换行空格 `U+00A0` 分解成普通空格） |
| `<vertical>` | 竖排专用的形态 |
| `<font>` | 只是换了字体样式的老变体 |
| `<initial>` `<medial>` `<final>` `<isolated>` | 阿拉伯文一个字母的四种连写形态 |

### 它决定的是 NFC / NFKC，不是“字体能不能拼出来”{#decomposition-forms}

规范分解与兼容分解的分歧，就是 NFC 与 NFKC 的分歧：NFKC 连兼容分解也合并，所以

```js
'ﬁ'.normalize('NFC')   // 'ﬁ'：不合并
'ﬁ'.normalize('NFKC')  // 'fi'：合并了
```

两条规矩：

- **存与比用 NFC**；做“看起来一样就算同一个”的归一（搜索、去重、生成 slug）用 NFKC；
- **NFKC 不能拿来展示**：`½` 会变成 `1⁄2`、全角 `Ａ` 会变半角，排版意图全没了。

还有一件更容易误会的事：分解表是 Unicode 在说“这两个码位等价”，**不是排版引擎的替换表**。字体里没有 `À` 时，引擎不会自己去拼 `A` + 重音符，能否拼出来取决于字体有没有对应标记的定位规则（`mark` / `ccmp`，见 [GSUB / GPOS](/)gsub-gpos)）。所以想让“组合写法”在任何字体里都靠得住，先 `normalize('NFC')` 合并成一个码位，让引擎只需要找一个字形。

## 数值：这个字代表哪个数 {#numeric}

`UnicodeData.txt` 第 7–9 列是三档数字，精度从高到低：

| 列 | 名称 | 意思 |
| --- | --- | --- |
| 7 | Decimal | 十进制数字，`0`–`9` 那类 |
| 8 | Digit | 是数字，但不一定是十进制 |
| 9 | Numeric | 数值本身，可以是分数、罗马数字 |

弹窗里显示 `1/2（Numeric）` 时，括号里是**命中的哪一档**（有 Decimal 就只报 Decimal）：

| 字符 | 三档 | 显示为 |
| --- | --- | --- |
| `7` | Decimal 7 / Digit 7 / Numeric 7 | `7（Decimal）` |
| `５`（全角） | Decimal 5 / Digit 5 / Numeric 5 | `5（Decimal）` |
| `①` | - / Digit 1 / Numeric 1 | `1（Digit）` |
| `½` | - / - / `1/2` | `1/2（Numeric）` |
| `Ⅷ` | - / - / 8 | `8（Numeric）` |

全角 `５` 也是十进制数字（同一个 `Nd` 类，只是另一个码位）；`①` 是数字但不是十进制数字，两档的差别就在这里。

写代码时这条会咬人：`Number('½')` 与 `Number('５')` 都是 `NaN`，`parseInt` 也一样，因为 JS 的数字字面量只认 ASCII。正则 `\d` 同样只匹配 ASCII 数字，要盖全 Unicode 的十进制数字得用 `\p{Nd}`（带 `u` 标志）。

## 大小写映射 {#case}

第 13–15 列给的是**单字符**映射：大写、小写、词首大写（titlecase）各一个码位。弹窗里显示成 `A / a` 这样，悬停看具体码位。

它是“UnicodeData 的简单映射”，不是 `toUpperCase()`：

- `ß`（`U+00DF`）在这三列里**没有**大写映射，而 `'ß'.toUpperCase()` 是 `'SS'`，即两个字符。多字符映射在另一张表（`SpecialCasing.txt`）里，本站没读它；
- 语言相关的例外（土耳其语的 `i` 大写是 `İ`、立陶宛语会重排重音）也在那张表；
- 所以弹窗里这一行读作“这个字符的一对一替换”，而不是“转成大写会变成什么”。

## 组合类与规范化 {#normalize}

`é` 可以是一个码位（`U+00E9`），也可以是两个（`U+0065` + `U+0301`）。两者看起来一样，但**字符串比较不等**：

```js
'é' === 'é'        // false：一个是预组合，一个是组合序列
'é'.normalize('NFC') === 'é'.normalize('NFC')  // true
```

Unicode 定义了四种规范化形式（NFC / NFD / NFKC / NFKD）。要比较用户输入、做搜索、存数据库，先 `normalize('NFC')` 是常规做法。

多个标记叠在一起时，谁在上谁在下由**组合类**（Combining Class，`UnicodeData.txt` 第 4 列）决定。它不是“谁更重要”，而是一个粗粒度的位置编号：

| 值 | 意思 | 例子 |
| --- | --- | --- |
| `0` | 自己不叠，是独立字符 | 普通字母 |
| `1` | 叠在字身上（overlay） | `U+0334` 叠加波浪线 |
| `220` | 落在下方 | `U+0323` 下加点 |
| `230` | 落在上方 | `U+0301` 锐音符 |

一个格子里叠了好几个标记时，规范会按这个数值重排（非 0 的从小到大），**只有数值相同**才看书写顺序。所以 `◌́` 和 `◌̣` 谁写在前面都不影响结果。这不是排版引擎的随意，而是规范化规则要求的稳定排序。

<figure style="margin: 2rem 0">
  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; overflow: hidden; border: 1px solid var(--color-neutral-200); border-radius: 6px; background-color: var(--color-neutral-200)">
    <div style="grid-column: 1 / -1; padding: 0.375rem 0.625rem; background-color: var(--color-neutral-50); font-size: 0.75rem; line-height: 1.5; color: var(--color-neutral-500)">同一个字：一个码位，还是两个</div>
    <div style="padding: 0.75rem 0.5rem; background-color: var(--color-white); text-align: center">
      <div style="font-size: 2.75rem; line-height: 1.2">&#xE9;</div>
      <div style="margin-top: 0.375rem; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; color: var(--color-neutral-500)">U+00E9</div>
    </div>
    <div style="padding: 0.75rem 0.5rem; background-color: var(--color-white); text-align: center">
      <div style="font-size: 2.75rem; line-height: 1.2">&#x65;&#x301;</div>
      <div style="margin-top: 0.375rem; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; color: var(--color-neutral-500)">U+0065 U+0301</div>
    </div>
    <div style="grid-column: 1 / -1; padding: 0.375rem 0.625rem; background-color: var(--color-neutral-50); font-size: 0.75rem; line-height: 1.5; color: var(--color-neutral-500)">两个标记都落在上方（组合类都是 230）：顺序由书写顺序决定</div>
    <div style="padding: 0.75rem 0.5rem; background-color: var(--color-white); text-align: center">
      <div style="font-size: 2.75rem; line-height: 1.2">&#x65;&#x301;&#x308;</div>
      <div style="margin-top: 0.375rem; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; color: var(--color-neutral-500)">U+0065 U+0301 U+0308</div>
    </div>
    <div style="padding: 0.75rem 0.5rem; background-color: var(--color-white); text-align: center">
      <div style="font-size: 2.75rem; line-height: 1.2">&#x65;&#x308;&#x301;</div>
      <div style="margin-top: 0.375rem; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; color: var(--color-neutral-500)">U+0065 U+0308 U+0301</div>
    </div>
  </div>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; line-height: 1.6; color: var(--color-neutral-500)">
    第一行两个格子<strong>看起来一样</strong>，但在代码里是两个不同的字符串：<code>length</code> 是 1 与 2，<code>===</code> 是 <code>false</code>。
    第二行交换了两个标记的书写顺序：组合类相同（<code>U+0301</code> 与 <code>U+0308</code> 都是 230），所以规范不会替你重排，谁先写谁离字身更近。
    如果这两格在你的屏幕上糊成一团，那是这个字体没有标记定位（<code>mark</code> 特性），不是规则错了。
  </figcaption>
</figure>

组合类同样是“规范化”那套规则的一部分：它是 NFC / NFD 重排标记的依据。至于“看起来的一个字”到底由哪些码位组成，那是**字素簇**，见 [码位与平面](/)unicode-codepoints#sequences)。

## 双向类与镜像 {#bidi}

第 5 列是双向类（Bidi_Class），第 10 列是“是否镜像”。这两个都是**每个字符自带的属性**，不是段落上的设置：

| 代码 | 全称 | 例子 |
| --- | --- | --- |
| `L` | Left-to-Right | 拉丁字母 |
| `R` | Right-to-Left | 希伯来字母 |
| `AL` | Arabic Letter | 阿拉伯字母 |
| `EN` | European Number | `7` |
| `AN` | Arabic Number | `٧`（`U+0667`） |
| `ON` | Other Neutral | 括号、逗号 |
| `NSM` | Nonspacing Mark | 组合重音 |

`٧` 与 `7` 是好例子：同一个数值，一个是阿拉伯数字（`AN`），一个是欧洲数字（`EN`），两者在双向算法里的行为不同。

镜像（Mirrored）是给从右到左的段落用的：`(` `)` `<` `>` 这些字符进了 RTL 段要换成另一侧的形态。`U+0028` 左括号的镜像标记是 `Y`。

谁在哪一侧、括号怎么换，是双向算法（UAX #9）的事，见 [书写方向](/)writing-direction)。这里只记一句：**它是字符自己的属性，在弹窗里看得到**。

## 同一个字，七种写法 {#escapes}
<!-- hint: 转义写法 | 同一个码位在 HTML、C、JavaScript、CSS 和 URL 中有不同的表示方式。URL 的 %XX 按字节编码，与码位没有直接关系。 -->

弹窗底部那张表不是罗列癖。前四项其实是“同一个数换个前缀”：

| 写法 | 是什么 |
| --- | --- |
| `&#201;` | HTML 实体，十进制（也可以写 `&#x00C9;`） |
| `0x00C9` | C 系的十六进制字面量，把码位当**数**写出来 |
| `\u00C9` | JavaScript / JSON 的字符串转义 |
| `\00C9` | CSS 的反斜杠转义（最多六位十六进制，后面可跟一个空格收尾） |

后三项各有各的语法：`\u{00C9}`（Ruby、PHP 的大括号形式）、`\x{00C9}`（Perl）、`%C3%89`（URL 编码）。

为什么各行其道：这些语法不是一起设计的。`0x` 来自 1970 年代的 C；CSS 用反斜杠是为了在样式表里也能塞进任意字符；HTML 实体是更早的字符集切换时代的产物；而 URL 的 `%XX` **是字节级的**，跟码位没有关系，所以一个汉字要三个 `%XX`，一个 emoji 要四个。

星平面是这个表最有用的时候：`U+1F600` 在 JavaScript 里没有单字符转义，必须写成代理对 `\uD83D\uDE00`，写成一个 `\u1F600` 会被读成 `\u1F60` 再加个 `0`。

## 弹窗里这几行是什么 {#this-site}

在检查器的覆盖面板点一个字符，弹出来的窗分三段：

1. **头**：标题与这个字符的码位，右上角关闭；
2. **内容**（可能要滚）：
   - 字形预览：载入了字体才是这个字体的字形，否则是回退字体；
   - 正式名字、码位、在不在当前字体里；
   - **属性表**：类别、分解 / 兼容分解、数值、大小写、组合类、双向类、镜像、旧名；
   - **转义表**：上面那七种写法；
   - **区块段**：区块名、范围、`已分配 / 区块大小`、类别分布。
3. **底**：四个翻字符按钮，分别是上一个 / 下一个（相邻码位），以及“上一个可用 / 下一个可用”（只走这个字体有的那些）。

三处细节值得知道：

- 属性表**只列有值的行**。一个 `A` 不会给你四行空白，而一个汉字会摆出“类别 / 双向类”两行、别的都没有，因为汉字在 `UnicodeData.txt` 里是大区间压缩的（`<CJK Ideograph, First>`），那些列本来就是空的，不是我们没读到；
- 分解与大小写这两行的格子带省略号，**悬停**能看原始码位。`À` 到底是不是 `0041 0300`，光看字形看不出来；
- “类别”显示成 `Uppercase Letter（Lu）`：全称给人读，代码给对照规范用。**代码不翻译**，中文资料里也是写 `Lu`。

## 延伸阅读

- Unicode 标准第 4 章（Character Properties）
- UAX #15（Unicode 规范化）、UAX #9（双向算法）、UAX #29（字素簇边界）
- Unicode 官方：`UnicodeData.txt`（15 列的含义就在文件头）、`extracted/DerivedName.txt`
