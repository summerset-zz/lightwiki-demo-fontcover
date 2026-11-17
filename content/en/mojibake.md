---
title: Mojibake
description: 'What you see when the wrong encoding is used: why it happens, how to tell which step went wrong, and how to recover.'
keywords: 乱码, mojibake, 编码, GBK, Shift_JIS, charset, 亂碼
section: unicode
order: 10
updated: 2026-11-07
sourceSite: en.wikipedia.org
sourceTitle: Mojibake
sourceRevid: 1384045614
sourceUrl: https://en.wikipedia.org/w/index.php?oldid=1384045614
sourceLicense: Creative Commons Attribution-Share Alike 4.0
sourceLicenseUrl: https://creativecommons.org/licenses/by-sa/4.0/deed.en
sourceRetrieved: 2026-11-07
sourceChanges: 删除了全部图片、公式、引用角标、信息框、表格标题与“See also”类收尾小节；正文文字未改动。
hintTitle: Mojibake
hint: What appears when text is decoded with the wrong encoding — most often UTF-8 read as GBK, or the reverse.
---

**Mojibake** (Japanese: 文字化け; IPA: \[mo.(d)ʑi.ba.ke\], 'character transformation') is the garbled or gibberish text that is the result of text being decoded using an unintended character encoding. The result is a systematic replacement of symbols with completely unrelated ones, often from a different writing system.

This display may include the generic replacement character ⟨�⟩ in places where the binary representation is considered invalid. A replacement can also involve multiple consecutive symbols, as viewed in one encoding, when the same binary code constitutes one symbol in the other encoding. This is either because of differing constant length encoding (as in Asian 16-bit encodings vs European 8-bit encodings), or the use of variable length encodings (notably UTF-8 and UTF-16).

Failed rendering of glyphs due to either missing fonts or missing glyphs in a font is a different issue that is not to be confused with mojibake. Symptoms of this failed rendering include blocks with the code point displayed in hexadecimal or using the generic replacement character. Importantly, these replacements are *valid* and are the result of correct error handling by the software.

## Causes {#Causes}

To correctly reproduce the original text that was encoded, the correspondence between the encoded data and the notion of its encoding must be preserved (i.e. the source and target encoding standards must be the same). As mojibake is the instance of non-compliance between these, it can be achieved by manipulating the data itself, or just relabeling it.

Mojibake is often seen with text data that have been tagged with a wrong encoding; it may not even be tagged at all, but moved between computers with different default encodings. A major source of trouble are communication protocols that rely on settings on each computer rather than sending or storing metadata together with the data.

The differing default settings between computers are in part due to differing deployments of Unicode among operating system families, and partly the legacy encodings' specializations for different writing systems of human languages. Whereas Linux distributions mostly switched to UTF-8 in 2004, Microsoft Windows generally uses UTF-16, and sometimes uses 8-bit code pages for text files in different languages.

For some writing systems, such as Japanese, several encodings have historically been employed, causing users to see mojibake relatively often. As an example, the word *mojibake* itself (`文字化け`) stored as EUC-JP might be incorrectly displayed as `ﾊｸｻ�ｽ､ｱ`, `ﾊｸｻ嵂ｽ､ｱ` (MS-932), or `ﾊｸｻ郾ｽ､ｱ` if interpreted as Shift-JIS, or as `Ê¸»ú²½¤±` in software that assumes text to be in the Windows-1252 or ISO 8859-1 encodings, usually labelled *Western* or *Western European*. This is further exacerbated if other locales are involved: the same text stored as UTF-8 may appear as `譁�蟄怜喧縺�` if interpreted as Shift-JIS, as `æ–‡å­—åŒ–ã‘` if interpreted as Western, or (for example) as `鏂囧瓧鍖栥亼` if interpreted as being in a GBK (Mainland China) locale.

|     |     |     |     |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Original text | 文   |     |     |     |     |     | 字   |     |     |     |     |     | 化   |     |     |     |     |     | け   |     |     |     |     |     |
| Raw bytes of EUC-JP encoding | CA  |     |     | B8  |     |     | BB  |     |     | FA  |     |     | B2  |     |     | BD  |     |     | A4  |     |     | B1  |     |     |
| EUC-JP bytes interpreted as Shift-JIS | ﾊ   |     |     | ｸ   |     |     | ｻ   |     |     | 郾   |     |     |     |     |     | ｽ   |     |     | ､   |     |     | ｱ   |     |     |
| EUC-JP bytes interpreted as GBK | 矢   |     |     |     |     |     | 机   |     |     |     |     |     | 步   |     |     |     |     |     | け   |     |     |     |     |     |
| EUC-JP bytes interpreted as Windows-1252 | Ê   |     |     | ¸   |     |     | »   |     |     | ú   |     |     | ²   |     |     | ½   |     |     | ¤   |     |     | ±   |     |     |
| Raw bytes of UTF-8 encoding | E6  |     | 96  |     | 87  |     | E5  |     | AD  |     | 97  |     | E5  |     | 8C  |     | 96  |     | E3  |     | 81  |     | 91  |     |
| UTF-8 bytes interpreted as Shift-JIS | 譁   |     |     |     | �   |     | 蟄   |     |     |     | 怜   |     |     |     | 喧   |     |     |     | 縺   |     |     |     | �   |     |
| UTF-8 bytes interpreted as GBK | 鏂   |     |     |     | 囧   |     |     |     | 瓧   |     |     |     | 鍖   |     |     |     | 栥   |     |     |     | 亼   |     |     |     |
| UTF-8 bytes interpreted as Windows-1252 | æ   |     | –   |     | ‡   |     | å   |     | SHY |     | —   |     | å   |     | Œ   |     | –   |     | ã   |     | HOP |     | ‘   |     |

### Underspecification {#Underspecification}

If the encoding is not specified, it is up to the software to decide it by other means. Depending on the type of software, the typical solution is either configuration or charset detection heuristics, both of which are prone to mis-prediction.

The encoding of text files is affected by locale setting, which depends on the user's language and brand of operating system, among other conditions. Therefore, the assumed encoding is systematically wrong for files that come from a computer with a different setting, or even from a differently localized piece of software within the same system. For Unicode, one solution is to use a byte order mark, but many parsers do not tolerate this for source code or other machine-readable text. Another solution is to store the encoding as metadata in the file system; file systems that support extended file attributes can store this as `user.charset`. This also requires support in software that wants to take advantage of it, but does not disturb other software.

While some encodings are easy to detect, such as UTF-8, there are many that are hard to distinguish (see charset detection). For example, a web browser may not be able to distinguish between a page coded in EUC-JP and another in Shift-JIS if the encoding is not assigned explicitly using HTTP headers sent along with the documents, or using the document's meta tags that are used to substitute for missing HTTP headers if the server cannot be configured to send the proper HTTP headers; see character encodings in HTML.

### Mis-specification {#Mis-specification}

Mojibake also occurs when the encoding is incorrectly specified. This often happens between encodings that are similar. For example, the Eudora email client for Windows was known to send emails labelled as ISO 8859-1 that were in reality Windows-1252. Windows-1252 contains extra printable characters in the C1 range (the most frequently seen being curved quotation marks and extra dashes), that were not displayed properly in software complying with the ISO standard; this especially affected software running under other operating systems such as Unix.

#### User oversight {#User_oversight}

Of the encodings still in common use, many originated from taking ASCII and appending atop it; as a result, these encodings are partially compatible with each other. Examples of this include Windows-1252 and ISO 8859-1. People thus may mistake the expanded encoding set they are using with plain ASCII.

### Overspecification {#Overspecification}

When there are layers of protocols, each trying to specify the encoding based on different information, the least certain information may be misleading to the recipient. For example, a web server serving a static HTML file over HTTP can communicate the character set to the client in any number of 3 ways:

-   in the HTTP header. This information can be based on server configuration (for instance, when serving a file off disk) or controlled by the application running on the server (for dynamic websites).
-   in the file, as an HTML meta tag (`http-equiv` or `charset`) or the `encoding` attribute of an XML declaration. This is the encoding that the author meant to save the particular file in.
-   in the file, as a byte order mark. This is the encoding that the author's editor actually saved it in. Unless an accidental encoding conversion has happened (by opening it in one encoding and saving it in another), this will be correct. It is, however, only available in Unicode encodings such as UTF-8 or UTF-16.

### Lack of hardware or software support {#Lack_of_hardware_or_software_support}

Much older hardware is typically designed to support only one character set and the character set typically cannot be altered. The character table contained within the display firmware will be localized to have characters for the country the device is to be sold in, and typically the table differs from country to country. As such, these systems will potentially display mojibake when loading text generated on a system from a different country. Likewise, many early operating systems do not support multiple encoding formats and thus will end up displaying mojibake if made to display non-standard text – early versions of Microsoft Windows and Palm OS for example, are localized on a per-country basis and will only support encoding standards relevant to the country the localized version will be sold in, and thus will display mojibake if a file containing a text in a different encoding format from the version that the OS is designed to support is opened.

## Resolutions {#Resolutions}

Applications using UTF-8 as a default encoding may achieve a greater degree of interoperability because of its widespread use and backward compatibility with ASCII. UTF-8 also has the ability to be directly recognized by a simple algorithm, so that well-written software should be able to avoid mixing UTF-8 up with other encodings.

The difficulty of resolving an instance of mojibake varies depending on the application within which it occurs and the causes of it. Two of the most common applications in which mojibake may occur are web browsers and word processors. Modern browsers and word processors often support a wide array of character encodings. Browsers often allow a user to change their rendering engine's encoding setting on the fly, while word processors allow the user to select the appropriate encoding when opening a file. It may take some trial and error for users to find the correct encoding.

The problem gets more complicated when it occurs in an application that normally does not support a wide range of character encoding, such as in a non-Unicode computer game. In this case, the user must change the operating system's encoding settings to match that of the game. However, changing the system-wide encoding settings can also cause Mojibake in pre-existing applications. In Windows XP or later, a user also has the option to use Microsoft AppLocale, an application that allows the changing of per-application locale settings. Even so, changing the operating system encoding settings is not possible on earlier operating systems such as Windows 98; to resolve this issue on earlier operating systems, a user would have to use third party font rendering applications.

## Problems in different writing systems {#Problems_in_different_writing_systems}

### English {#English}

Mojibake in English texts generally occurs in punctuation, such as em dashes (—), en dashes (–), and curly quotes (“, ”, ‘, ’), but rarely in character text, since most encodings agree with ASCII on the encoding of the English alphabet. For example, the pound sign `£` will appear as `Â£` if it was encoded by the sender as UTF-8 but interpreted by the recipient as one of the Western European encodings (CP1252 or ISO 8859-1). If iterated using CP1252, this can lead to `Ã‚Â£`, `Ãƒâ€šÃ‚Â£`, `ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£`, `ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£`, and so on.

Similarly, the right single quotation mark (’), when encoded in UTF-8 and decoded using Windows-1252, becomes `â€™`, `Ã¢â‚¬â„¢`, `ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢`, and so on.

In older eras, some computers had vendor-specific encodings which caused mismatch also for English text. Commodore brand 8-bit computers used PETSCII encoding, particularly notable for inverting the upper and lower case compared to standard ASCII. PETSCII printers worked fine on other computers of the era, but inverted the case of all letters. IBM mainframes use the EBCDIC encoding which does not match ASCII at all.

### Other Western European languages {#Other_Western_European_languages}

The alphabets of the North Germanic languages, Catalan, Romanian, Finnish, French, German, Italian, Portuguese and Spanish are all extensions of the Latin alphabet. The additional characters are typically the ones that become corrupted, making texts only mildly unreadable with mojibake:

-   å, ä, ö in Finnish and Swedish (š and ž are present in some Finnish loanwords, é marginally in Swedish, mainly also in loanwords)
-   à, ç, è, é, ï, í, ò, ó, ú, ü in Catalan
-   æ, ø, å in Norwegian and Danish as well as optional acute accents on é, ǿ etc for disambiguation
-   á, é, ó, ĳ, è, ë, ï in Dutch
-   ä, ö, ü, and ß in German
-   á, ð, í, ó, ú, ý, æ, ø in Faroese
-   á, ð, é, í, ó, ú, ý, þ, æ, ö in Icelandic
-   à, â, ç, è, é, ë, ê, ï, î, ô, ù, û, ü, ÿ, æ, œ in French
-   à, è, é, ì, ò, ù in Italian
-   á, é, í, ñ, ó, ú, ü, ¡, ¿ in Spanish
-   à, á, â, ã, ç, é, ê, í, ó, ô, õ, ú in Portuguese (ü no longer used)
-   á, é, í, ó, ú in Irish
-   à, è, ì, ò, ù in Scottish Gaelic
-   ă, â, î, ș, ț in Romanian
-   £ in British English (æ and œ are rarely used, as are é and ê in some loanwords)

...and their uppercase counterparts, if applicable.

These are languages for which the ISO 8859-1 character set (also known as *Latin 1* or *Western*) has been in use. However, ISO 8859-1 has been obsoleted by two competing standards, the backward compatible Windows-1252, and the slightly altered ISO 8859-15. Both add the Euro sign € and the French œ, but otherwise any confusion of these three character sets does not create mojibake in these languages. Furthermore, it is always safe to interpret ISO 8859-1 as Windows-1252, and fairly safe to interpret it as ISO 8859-15, in particular with respect to the Euro sign, which replaces the rarely used currency sign (¤). However, with the advent of UTF-8, mojibake has become more common in certain scenarios, e.g. exchange of text files between UNIX and Windows computers, due to UTF-8's incompatibility with Latin-1 and Windows-1252. But UTF-8 can be directly recognised by a simple algorithm, so that well-written software should be able to avoid mixing UTF-8 up with other encodings, so this was most common when many had software not supporting UTF-8. Most of these languages were supported by MS-DOS default CP437 and other machine default encodings, except ASCII, so problems when buying an operating system version were less common. Windows and MS-DOS are not compatible, however.

In Swedish, Norwegian, Danish and German, vowels are rarely repeated, and it is usually obvious when one character gets corrupted, e.g. the second letter in the Swedish word `kärlek` ("love") when it is encoded in UTF-8 but decoded in Western, producing `kÃ⁠¤rlek`, or `für` in German, which becomes `fÃ¼r`. This way, even though the reader has to guess what the original letter is, almost all texts remain legible. Finnish, on the other hand, frequently uses repeating vowels in words like **hääyö** ("wedding night") which can make corrupted text very hard to read (e.g. `hääyö` appears as `hÃ⁠¤Ã⁠¤yÃ⁠¶`). Icelandic has ten possibly confounding characters, and Faroese has eight, making many words almost completely unintelligible when corrupted (e.g. Icelandic `þjóðlöð`, "outstanding hospitality", appears as `Ã¾jÃ³Ã°lÃ¶Ã°`).

In German, **Buchstabensalat** ("letter salad") is a common term for this phenomenon, in Spanish, **deformación** (literally "deformation") is used, and in Portuguese, **desformatação** (literally "deformatting") is used.

Some users transliterate their writing when using a computer, either by omitting the problematic diacritics, or by using digraph replacements (å → aa, ä/æ → ae, ö/ø → oe, ü → ue, etc.). Thus, an author might write "ueber" instead of "über", which is standard practice in German when umlauts are not available. The latter practice seems to be better tolerated in the German language sphere than in the Nordic countries. For example, in Norwegian, digraphs are associated with archaic Danish, and may be used jokingly. However, digraphs are useful in communication with other parts of the world. As an example, the Norwegian football player Ole Gunnar Solskjær had his last name spelled "SOLSKJAER" on his uniform when he played for Manchester United.

An artifact of UTF-8 misinterpreted as ISO 8859-1, `Ring meg nå` being rendered as `Ring meg nÃ¥`, was seen in 2014 in an SMS scam targeting Norway.

-   **Swedish example** · **Source encoding** · **Target encoding** · **Result / (Characters in red are incorrect.)**
-   Smörgås / (open sandwich) · MS-DOS 437 · ISO 8859-1 · Smrgs
-   UTF-8 · ISO 8859-1 · SmÃ¶rgÃ¥s
-   UTF-8 · IBM/CP037 (EBCDIC) · ë\_C¶ÊÅCvË
-   UTF-8 · Mac Roman · Sm√∂rg√•s
-   ISO 8859-1 · Mac Roman · SmˆrgÂs

The same problem occurs also in Romanian, see these examples:

-   **Romanian example** · **Source encoding** · **Target encoding** · **Result / (Characters in red are incorrect.)**
-   Cenușă / (ash) · UTF-8 · ASCII · CenuÈ™Äƒ
-   ISO 8859-2 · CenuČÄ
-   OEM 737 · Cenu╚β─Δ
-   Shift-JIS · Cenuﾈ卞
-   TIS-620 · Cenuศฤ
-   IBM/CP037 (EBCDIC) · äÁ>ÍHrDc

### Central and Eastern European {#Central_and_Eastern_European}

Users of Central and Eastern European languages can also be affected. Because most computers were not connected to any network during the mid- to late-1980s, there were different character encodings for every language with diacritical characters (see ISO/IEC 8859 and KOI-8), often also varying by operating system.

#### Hungarian {#Hungarian}

In Hungarian, the phenomenon is referred to as *betűszemét*, meaning "letter garbage". Hungarian has been particularly susceptible as it contains the accented letters á, é, í, ó, ú, ö, ü (all present in the Latin-1 character set), plus the two characters ő and ű which are not in Latin-1. These two characters can be correctly encoded in Latin-2, Windows-1250, and Unicode. However, before Unicode became common in e-mail clients, e-mails containing Hungarian text often had the letters ő and ű corrupted, sometimes to the point of unrecognizability. It is common to respond to a corrupted e-mail with the nonsense phrase ["Árvíztűrő tükörfúrógép"](https://hu.wikipedia.org/wiki/%C3%81rv%C3%ADzt%C5%B1r%C5%91_t%C3%BCk%C3%B6rf%C3%BAr%C3%B3g%C3%A9p) (literally "Flood-resistant mirror-drilling machine") which contains all accented characters used in Hungarian.

##### Examples {#Examples}

-   **Hungarian example** · **Source encoding** · **Target encoding** · **Result** · **Occurrence**
-   ÁRVÍZTŰRŐ TÜKÖRFÚRÓGÉP / árvíztűrő tükörfúrógép · **UTF-8 Quoted-printable** · **7-bit ASCII** · =C3=81RV=C3=8DZT=C5=B0R=C5=90 T=C3=9CK=C3=96RF=C3=9AR=C3=93G=C3=89P =C3=A1rv=C3=ADzt=C5=B1r=C5=91 t=C3=BCk=C3=B6rf=C3=BAr=C3=B3g=C3=A9p · Mainly caused by incorrectly-configured mail servers, but may occur in SMS messages on some cell phones as well.
-   **ISO 8859-2 Quoted-printable** · **7-bit ASCII** · =C1RV=CDZT=DBR=D5 T=DCK=D6RF=DAR=D3G=C9P / =E1rv=EDzt=FBr=F5 t=FCk=F6rf=FAr=F3g=E9p
-   **CWI-2** · **CP 437** · ÅRVìZTÿRº TÜKÖRFùRòGÉP / árvíztûrô tükörfúrógép · The CWI-2 code page was designed so that Hungarian text remains fairly well-readable even if the device on the receiving end uses a Western European encoding (CP 437 or CP 850). This encoding was used very heavily between the early 1980s and early 1990s, but nowadays it is completely deprecated.
-   **CP 852** · **CP 437** · ╡RV╓ZTδRè TÜKÖRFΘRαGÉP / árvízt√rï tükörfúrógép · This was very common in the days of MS-DOS, as text was often encoded using code page 852 ("Central European"), but the software on the receiving end (in Western European countries) often did not support CP 852 and instead tried to display text using CP 437 or CP 850. Lowercase letters are mainly correct, except for ű and ő. Ü/ü and Ö/ö are correct because CP 437 and CP 850 were made compatible with German. Although this is rare nowadays, it can still be seen in places such as on printed prescriptions and cheques.
-   **CP 852** · **CP 850** · ÁRVÍZTÙRè TÜKÖRFÚRÓGÉP / árvízt¹rï tükörfúrógép
-   **CP 852** · **Windows-1250** · µRVÖZTëRŠ TšK™RFéRŕGP / rvˇztűr‹ tk"rfŁr˘g‚p · Both encodings are Central European, but the text is encoded with the MS-DOS code page and decoded with the Windows code page. The use of ű is correct.
-   **CP 852** · **Mac Roman** · µRV÷ZTÎRä TöKôRFÈR‡GêP / †rv°zt˚rã tÅkîrf£r¢gÇp · Also common in the days of MS-DOS, this could be seen when Apple computers tried to display Hungarian text sent using DOS or Windows machines, as they would often default to Apple's own encoding.
-   **Windows-1250** · **Mac Roman** · ¡RVÕZT€R’ T‹K÷RF⁄R”G…P / ·rvÌzt˚rı t¸kˆrf˙rÛgÈp
-   **Windows-1250** · **CP 852** · ┴RV═ZT█RŇ T▄KÍRF┌RËG╔P / ßrvÝztűr§ tŘk÷rf˙rˇgÚp · Both encodings are Central European, but the text is encoded with the Windows code page and decoded with the DOS code page. The use of ű is correct.
-   **Windows-1250** · **Windows-1252** · ÁRVÍZTÛRÕ TÜKÖRFÚRÓGÉP / árvíztûrõ tükörfúrógép · The default Western European Windows encoding is used instead of the Central-European one. Only ő-Ő (õ-Õ) and ű-Ű (û-Û) are wrong, and the text is completely readable. Before UTF-8 became the most popular encoding, this often occurred on webpages and even in printed media.
-   **UTF-8** · **Windows-1252** · ÃRVÃZTÅ°RÅ TÃœKÃ–RFÃšRÃ"GÃ‰P / Ã¡rvÃztÅ±rÅ‘ tÃ¼kÃ¶rfÃºrÃ³gÃ©p · Mainly caused by web services or webmail clients that are configured incorrectly or not tested for international usage (as the problem remains concealed for English texts). In this case the actual (often generated) content is in UTF-8, but some older software may default to localized encodings if UTF-8 is not explicitly specified in the HTML headers. UTF-8 being misinterpreted as Windows-1252 is the most common error nowadays, as many applications default to ISO 8859-1 or Windows-1252.
-   **UTF-8** · **Mac Roman** · √ÅRV√çZT≈∞R≈ê T√úK√ñRF√öR√ìG√âP / √°rv√≠zt≈±r≈ë t√ºk√∂rf√∫r√≥g√©p

#### Polish {#Polish}

Prior to the creation of ISO 8859-2 in 1987, users of various computing platforms used their own character encodings such as AmigaPL on Amiga, Atari Club on Atari ST and Masovia, IBM CP 852, Mazovia and Windows-1250 on IBM PCs. Polish companies selling early DOS computers created their own mutually-incompatible ways to encode Polish characters and simply reprogrammed the EPROMs of the video cards (typically CGA, EGA, or Hercules) to provide hardware code pages with the needed glyphs for Polish – arbitrarily located with no reference whatsoever to where other computer sellers had placed them.

The situation began to improve when, after pressure from academic and user groups, ISO 8859-2 succeeded as the "Internet standard" with limited support of the dominant vendors' software (today largely replaced by Unicode). With the numerous problems caused by the variety of encodings, even today some users tend to refer to Polish diacritical characters as *krzaczki* (\[ˈkʂät͜ʂ.ki\], lit. "little shrubs").

##### Examples {#Examples_2}

-   **Polish example** · **Source encoding** · **Target encoding** · **Result**
-   ZAŻÓŁĆ GĘŚLĄ JAŹŃ / zażółć gęślą jaźń
-   **UTF-8 Quoted-printable** · **7-bit ASCII** · ZA=C5=BB=C3=93=C5=81=C4=86 G=C4=98=C5=9AL=C4=84 JA=C5=B9=C5=83 / za=C5=BC=C3=B3=C5=82=C4=87 g=C4=99=C5=9Bl=C4=85 ja=C5=BA=C5=84
-   **ISO 8859-2 Quoted-printable** · **7-bit ASCII** · ZA=AF=D3=A3=C6 G=CA=A6L=A1 JA=AC=D1 / za=BF=F3=B3=E6 g=EA=B6l=B1 ja=BC=F1
-   **Mazovia** · **CP 437** · ZAíú£ò GÉÿLÅ JAáÑ / zaºóÆì gæ₧lå jaªñ
-   **CP 852** · **CP 437** · ZA╜α¥Å G¿ùLñ JAìπ / za╛óêå g⌐ÿlÑ ja½Σ
-   **CP 852** · **CP 850** · ZA¢ÓØÅ G¿ùLñ JAìÒ / za¥óêå g®ÿlÑ ja½Õ
-   **Windows-1250** · **Windows-1252** · ZA¯Ó£Æ GÊ¦L¡ JA¬Ñ / za¿ó³æ gê¶l± ja¼ñ
-   **UTF-8** · **Windows-1252** · ZAÅ»Ã“Å&#x81;Ä† GÄ˜ÅšLÄ„ JAÅ¹Åƒ / zaÅ¼Ã³Å‚Ä‡ gÄ™Å›lÄ… jaÅºÅ„
-   **UTF-8** · **Mac Roman** · ZA≈ª√ì≈ÅƒÜ Gƒò≈öLƒÑ JA≈π≈É / za≈º√≥≈Çƒá gƒô≈õlƒÖ ja≈∫≈Ñ

#### Russian and other Cyrillic-based alphabets {#Russian_and_other_Cyrillic-based_alphabets}

Mojibake is colloquially called *krakozyabry* (кракозя́бры \[krɐkɐˈzʲæbrɪ̈\]) in Russian, which was and remains complicated by several systems for encoding Cyrillic. The Soviet Union and early Russian Federation developed KOI encodings (Kod Obmena Informatsiey, Код Обмена Информацией, which translates to "Code for Information Exchange"). This began with Cyrillic-only 7-bit KOI7, based on ASCII but with Latin and some other characters replaced with Cyrillic letters. Then came 8-bit KOI8 encoding that is an ASCII extension which encodes Cyrillic letters only with high-bit set octets corresponding to 7-bit codes from KOI7. It is for this reason that KOI8 text, even Russian, remains partially readable after stripping the eighth bit, which was considered as a major advantage in the age of 8BITMIME-unaware email systems. For example, the words `Школа русского языка` (*shkola russkogo yazyka*), when encoded in KOI8 and passed through the high bit stripping process, end up being rendered as `[KOLA RUSSKOGO qZYKA`. Eventually, KOI8 gained different flavors for Russian and Bulgarian (KOI8-R), Ukrainian (KOI8-U), Belarusian (KOI8-RU), and even Tajik (KOI8-T).

Meanwhile, in the West, Code page 866 supported Ukrainian and Belarusian, as well as Russian and Bulgarian in MS-DOS. For Microsoft Windows, Code Page 1251 added support for Serbian and other Slavic variants of Cyrillic.

Most recently, the Unicode encoding includes code points for virtually all characters in all languages, including all Cyrillic characters.

Before Unicode, it was necessary to match text encoding with a font using the same encoding system; failure to do this produced unreadable gibberish whose specific appearance varied depending on the exact combination of text and font encoding. For example, attempting to view non-Unicode Cyrillic text using a font that is limited to the Latin alphabet, or using the default ("Western") encoding, typically results in text that consists almost entirely of vowels with diacritical marks (e.g. KOI8 `Библиотека` (*biblioteka*, library) becomes `âÉÂÌÉÏÔÅËÁ`, while `Школа русского языка` (*shkola russkogo yazyka*, Russian-language school) becomes `ûËÏÌÁ ÒÕÓÓËÏÇÏ ÑÚÙËÁ`. Using Code Page 1251 to view text in KOI8, or vice versa, results in garbled text that consists mostly of capital letters, as KOI8 and Code Page 1251 share the same ASCII region, but KOI8 has uppercase letters in the region where Code Page 1251 has lowercase, and vice versa.

During the early years of the Russian sector of the World Wide Web, both KOI8 and Code Page 1251 were common. Nearly all websites now use Unicode, but as of November 2023, an estimated 0.35% of all web pages worldwide—all languages included—are still encoded in Code Page 1251, while less than 0.003% of sites are still encoded in KOI8-R. Though the HTML standard includes the ability to specify the encoding for any given web page in its source, this is sometimes neglected, forcing the user to switch encodings in the browser manually.

In Bulgarian, mojibake is often called *majmunica* (маймуница), meaning "monkey's \[alphabet\]". In Serbian, it is called *đubre* (ђубре), meaning "trash". Unlike the former USSR, South Slavs never used something like KOI8, and Code Page 1251 was the dominant Cyrillic encoding before Unicode; therefore, these languages experienced fewer encoding incompatibility troubles than Russian. In the 1980s, Bulgarian computers used their own MIK encoding, which is superficially similar to, although incompatible with, CP 866.

-   **Original text** · **Source encoding** · **Target encoding** · **Result**
-   Русский язык · Windows-1251 · KOI8-R · пСЯЯЙХИ ЪГШЙ
-   KOI8-R · Windows-1251 · тХУУЛЙК СЪЩЛ
-   Windows-1252 · òÕÓÓËÉÊ ÑÚÙË
-   MS-DOS 855 · Windows-1252 · âçããÆ·½ ÞóñÆ
-   Windows-1251 · Windows-1252 · Ðóññêèé ÿçûê
-   UTF-8 · Windows-1252 · Ð ÑƒÑÑÐºÐ¸Ð¹ ÑÐ·Ñ‹Ðº
-   KOI8-R · п═я┐я│я│п╨п╦п╧ я▐п╥я▀п╨
-   MS-DOS 855 · лаЛЃЛЂЛЂл║лИл╣ ЛЈлиЛІл║
-   Windows-1251 · Р СѓСЃСЃРєРёР№ СЏР·С‹Рє
-   Mac Roman · –†—É—Å—Å–∫–∏–π —è–∑—ã–∫
-   Mac Cyrillic · –†—Г—Б—Б–Ї–Є–є —П–Ј—Л–Ї

#### Yugoslav languages {#Yugoslav_languages}

Croatian, Bosnian, Serbian (the seceding varieties of Serbo-Croatian language) and Slovenian add to the basic Latin alphabet the letters š, đ, č, ć, ž, and their capital counterparts Š, Đ, Č, Ć, Ž (only č/Č, š/Š and ž/Ž are officially used in Slovenian, although others are used when needed, mostly in foreign names). All of these letters are defined in Latin-2 and Windows-1250, while only some (š, Š, ž, Ž, Đ) exist in the usual OS-default Windows-1252, and are there because of some other languages.

Although Mojibake can occur with any of these characters, the letters that are not included in Windows-1252 are much more prone to errors. Thus, even nowadays, attempting to display `ŠĐČĆŽ šđčćž` on legacy systems can give `ŠÐÈÆŽ šðèæž`, even though ð, È, and Æ are not used in Slavic languages.

When confined to basic ASCII (most user names, for example), common replacements are: š→s, đ→dj, č→c, ć→c, ž→z (capital forms analogously, with Đ→Dj or Đ→DJ depending on word case). All of these replacements introduce ambiguities, so reconstructing the original from such a form is usually done manually if required.

The Windows-1252 encoding is important because the English versions of the Windows operating system are most widespread, not localized ones. The reasons for this include a relatively small and fragmented market, increasing the price of high quality localization, a high degree of software piracy (in turn caused by high price of software compared to income), which discourages localization efforts, and people preferring English versions of Windows and other software.

The drive to differentiate Croatian from Serbian, Bosnian from Croatian and Serbian, and now even Montenegrin from the other three creates many problems. There are many different localizations, using different standards and of different quality. There are no common translations for the vast amount of computer terminology originating in English. In the end, many people use English loanwords ("kompjuter" for "computer", "kompajlirati" for "compile," etc.), and if they are unaccustomed to the translated terms, they may not understand what some option in a menu is supposed to do based on the translated phrase. Therefore, people who understand English, as well as those who are accustomed to English terminology (who are most, because English terminology is also mostly taught in schools because of these problems) regularly choose the original English versions of non-specialist software.

When Cyrillic script is used (for Macedonian and partially Serbian), the problem is similar to [other Cyrillic-based scripts](#Russian_and_other_Cyrillic-based_scripts).

Newer versions of English Windows allow the code page to be changed (older versions require special English versions with this support), but this setting can be and often was incorrectly set. For example, Windows 98 and Windows Me can be set to most non-right-to-left single-byte code pages including 1250, but only at install time.

### Asian encodings {#Asian_encodings}

Another type of mojibake occurs when text encoded in a single-byte encoding is erroneously parsed in a multi-byte encoding, such as one of the encodings for East Asian languages. With this kind of mojibake more than one (typically two) characters are corrupted at once. For example, if the Swedish word `kärlek` is encoded in Windows-1252 but decoded using GBK, it will appear as `k鋜lek`, where `är` is parsed as `鋜`. Compared to the above mojibake, this is harder to read, since letters unrelated to the problematic å, ä or ö are missing, and is especially problematic for short words starting with å, ä or ö (e.g. `än` becomes `鋘`). Since two letters are combined, the mojibake also seems more random (over 50 variants compared to the normal three, not counting the rarer capitals). In some rare cases, an entire text string which happens to include a pattern of particular word lengths, such as the sentence "Bush hid the facts", may be misinterpreted.

#### Vietnamese {#Vietnamese}

In Vietnamese, the phenomenon is called *chữ ma* (Hán–Nôm: 𡨸魔, "ghost characters") or *loạn mã* (from Chinese 乱码, *luànmǎ*). It can occur when a computer tries to decode text encoded in UTF-8 as Windows-1258, TCVN3 or VNI. In Vietnam, *chữ ma* was commonly seen on computers that ran pre-Vista versions of Windows or cheap mobile phones.

-   **Example** · **Source encoding** · **Target encoding** · **Result**
-   Trăm năm trong cõi người ta / 𤾓𢆥𥪞𡎝𠊛些 / (Truyện Kiều, Nguyễn Du) · UTF-8 · Windows-1258 · TrÄƒm nÄƒm trong cÃµi ngÆ°á»i ta / đ¤¾“đ¢†¥đ¥ªđ¡đ ›äº›
-   TCVN3 · Tr¨m n¨m trong câi ngêi ta / �¤¾��¢��¥¥ª��¡�����¾ä��
-   VNI (Windows) · Traêm naêm trong coõi ngöôøi ta / �����������������������
-   Mac Roman · TrƒÉm nƒÉm trong c√µi ng∆∞·ªùi ta / §æì¢Ü••™û°éù†äõ‰∫õ

#### Japanese {#Japanese}

In Japan, mojibake is especially problematic as there are many different Japanese text encodings. Alongside Unicode encodings (UTF-8 and UTF-16), there are other standard encodings, such as Shift-JIS (Windows machines) and EUC-JP (UNIX systems). Even to this day, mojibake is often encountered by both Japanese and non-Japanese people when attempting to run software written for the Japanese market.

-   **Original text** · **Source encoding** · **Target encoding** · **Result**
-   このメールは皆様へのメッセージです。 · UTF-8 · UTF-7 · ���̃��(�q���Y�\_�C�G�b�g)
-   UTF-8 · EUC-JP · �����＜�若������罕��吾���＜���祉�若�吾�с����
-   UTF-8 · Shift-JIS · 縺薙�繝｡繝ｼ繝ｫ縺ｯ逧�ｧ倥∈縺ｮ繝｡繝�そ繝ｼ繧ｸ縺ｧ縺吶�
-   UTF-8 · Mac Roman · „Åì„ÅÆ„É°„Éº„É´„ÅØÁöÜÊßò„Å∏„ÅÆ„É°„ÉÉ„Çª„Éº„Ç∏„Åß„Åô„ÄÇ
-   UTF-8 · ISO 8859-6 · كك�ك�ك�ك�ك�هن�ك�ك�ك�كك؛ك�ك�ك�كك
-   UTF-8 · Windows-1252 · ã“ã®ãƒ¡ãƒ¼ãƒ«ã¯çš†æ§˜ã¸ã®ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸ã§ã™ã€‚
-   EUC-JP · Windows-1252 · ¤³¤Î¥á¡¼¥ë¤Ï³§ÍÍ¤Ø¤Î¥á¥Ã¥»¡¼¥¸¤Ç¤¹¡£
-   Shift-JIS · Windows-1252 · ‚±‚Ìƒ\[ƒ‹‚ÍŠF—l‚Ö‚ÌƒƒbƒZ\[ƒW‚Å‚·B

#### Chinese {#Chinese}

In Chinese, the same phenomenon is called *Luàn mǎ* (Pinyin, Simplified Chinese 乱码, Traditional Chinese 亂碼, meaning 'chaotic code'), and can occur when computerised text is encoded in one Chinese character encoding but is displayed using the wrong encoding. When this occurs, it is often possible to fix the issue by switching the character encoding without loss of data. The situation is complicated because of the existence of several Chinese character encoding systems in use, the most common ones being: Unicode, Big5, and Guobiao (with several backward-compatible versions), and the possibility of Chinese characters being encoded using Japanese encoding.

It is relatively easy to identify the original encoding when *luànmǎ* occurs in Guobiao encodings:

-   **Original text** · **Source encoding** · **Target encoding** · **Result** · **Note**
-   三國志曹操傳 · Big5 · GB · �T瓣в变巨肚 · Garbled characters with almost no hint of original meaning. The red character is not a valid codepoint in GB 2312.
-   文字化けテスト · Shift-JIS · 暥帤壔偗僥僗僩 · Kana is displayed as characters with the 亻 (Chinese: 單人旁; pinyin: dānrénpáng) radical, while kanji are other characters. Many of the substitute characters are extremely uncommon in modern Chinese. Somewhat easy to identify due to the presence of multiple consecutive 亻 characters.
-   디제이맥스 테크니카 · EUC-KR · 叼力捞钙胶 抛农聪墨 · Random simplified characters which in most cases make no sense. Probably the easiest to identify because of spaces between every several characters.

An additional problem in Chinese occurs when rare or antiquated characters, many of which are still used in personal or place names, do not exist in some encodings. Examples of this are:

-   The Big5 encoding's lack of the "煊" (*xuān*) in the name of Taiwanese politician Wang Chien-shien (Chinese: 王建煊; pinyin: *Wáng Jiànxuān*), the "堃" (*kūn*) in the name of Yu Shyi-kun (simplified Chinese: 游锡堃; traditional Chinese: 游錫堃; pinyin: *Yóu Xíkūn*), and the "喆" (*zhé*) in the name of singer David Tao (Chinese: 陶喆; pinyin: *Táo Zhé*),
-   GB 2312's lack of the "镕" (*róng*) in ex-PRC Premier Zhu Rongji (Chinese: 朱镕基; pinyin: *Zhū Róngjī*), and
-   GBK's lack of the copyright symbol "©".

Newspapers have dealt with missing characters in various ways, including using image editing software to synthesize them by combining other radicals and characters; using a picture of the personalities (in the case of people's names), or simply substituting homophones in the hope that readers would be able to make the correct inference.

#### Indic text {#Indic_text}

A similar effect can occur in Brahmic or Indic scripts of South Asia, used in such Indo-Aryan or Indic languages as Hindustani (Hindi-Urdu), Bengali, Punjabi, Marathi, and others, even if the character set employed is properly recognized by the application. This is because, in many Indic scripts, the rules by which individual letter symbols combine to create symbols for syllables may not be properly understood by a computer missing the appropriate software, even if the glyphs for the individual letter forms are available.

One example of this is the old Wikipedia logo, which attempts to show the character analogous to "wi" (the first syllable of "Wikipedia") on each of many puzzle pieces. The puzzle piece meant to bear the Devanagari character for "wi" instead used to display the "wa" character followed by an unpaired "i" modifier vowel, easily recognizable as mojibake generated by a computer not configured to display Indic text. The logo as redesigned as of May 2010 has fixed these errors.

The idea of Plain Text requires the operating system to provide a font to display Unicode codes. This font is different from OS to OS for Singhala and it makes orthographically incorrect glyphs for some letters (syllables) across all operating systems. For instance, the 'reph', the short form for 'r' is a diacritic that normally goes on top of a plain letter. However, it is wrong to go on top of some letters like 'ya' or 'la' in specific contexts. For Sanskritic words or names inherited by modern languages, such as कार्य, IAST: *kārya*, or आर्या, IAST: *āryā*, it is apt to put it on top of these letters. By contrast, for similar sounds in modern languages which result from their specific rules, it is not put on top, such as the word करणाऱ्या, IAST: *karaṇāryā*, a stem form of the common word करणारा/री, IAST: *karaṇārā/rī*, in the Marathi language. But it happens in most operating systems. This appears to be a fault of internal programming of the fonts. In Mac OS and iOS, the muurdhaja l (dark l) and 'u' combination and its long form both yield wrong shapes.

Some Indic and Indic-derived scripts, most notably Lao, were not officially supported by Windows XP until the release of Vista. However, various sites have made free-to-download fonts.

#### Burmese {#Burmese}

Due to Western sanctions and the late arrival of Burmese language support in computers, much of the early Burmese localization was homegrown without international cooperation. The prevailing means of Burmese support is via the Zawgyi font, a font that was created as a Unicode font but was in fact only partially Unicode compliant. In the Zawgyi font, some codepoints for Burmese script were implemented as specified in Unicode, but others were not. The Unicode Consortium refers to this as *ad hoc font encodings*. With the advent of mobile phones, mobile vendors such as Samsung and Huawei simply replaced the Unicode-compliant system fonts with Zawgyi versions.

Due to these *ad hoc* encodings, communications between users of Zawgyi and Unicode would render as garbled text. To get around this issue, content producers would make posts in both Zawgyi and Unicode. Myanmar government designated 1 October 2019 as "U-Day" to officially switch to Unicode. The full transition was estimated to take two years.

### African languages {#African_languages}

In certain writing systems of Africa, unencoded text is unreadable. Texts that may produce mojibake include those from the Horn of Africa such as the Ge'ez script in Ethiopia and Eritrea, used for Amharic, Tigre, and other languages, and the Somali language, which employs the Osmanya alphabet. In Southern Africa, the Mwangwego alphabet is used to write languages of Malawi and the Mandombe alphabet was created for the Democratic Republic of the Congo, but these are not generally supported. Various other writing systems native to West Africa present similar problems, such as the N'Ko alphabet, used for Manding languages in Guinea, and the Vai syllabary, used in Liberia.

### Semitic languages {#Semitic_languages}

Other affected languages are Arabic and Hebrew (see [below](#Examples)), in which text becomes completely unreadable when the encodings do not match.

#### Examples {#Examples_3}

-   **Arabic example** · **Browser rendering** · **Source encoding** · **Target encoding** · **Result**
-   / (Universal Declaration / of Human Rights) · الإعلان العالمى لحقوق الإنسان · **UTF-8** · **KOI8-R** · ь╖ы└ь╔ь╧ы└ь╖ы├ ь╖ы└ь╧ь╖ы└ы┘ы┴ ы└ь╜ы┌ы┬ы┌ ь╖ы└ь╔ы├ьЁь╖ы├
-   **Windows-1250** · Ř§Ů„ŘĄŘąŮ„Ř§Ů† Ř§Ů„ŘąŘ§Ů„Ů…Ů‰ Ů„Ř­­Ů‚ŮŮ‚ Ř§Ů„ŘĄŮ†ŘłŘ§Ů†
-   **Windows-1251** · Ш§Щ„ШҐШ№Щ„Ш§Щ† Ш§Щ„Ш№Ш§Щ„Щ…Щ‰ Щ„Ш­Щ‚Щ€Щ‚ Ш§Щ„ШҐЩ†ШіШ§Щ†
-   **Windows-1252** · Ø§Ù„Ø¥Ø¹Ù„Ø§Ù† Ø§Ù„Ø¹Ø§Ù„Ù…Ù‰ Ù„Ø­Ù‚ÙˆÙ‚ Ø§Ù„Ø¥Ù†Ø³Ø§Ù†
-   **Windows-1256** · ط§ظ„ط¥ط¹ظ„ط§ظ† ط§ظ„ط¹ط§ظ„ظ…ظ‰ ظ„ط­ظ‚ظˆظ‚ ط§ظ„ط¥ظ†ط³ط§ظ†
-   **ISO 8859-5** · иЇй�иЅиЙй�иЇй� иЇй�иЙиЇй�й�й� й�ий�й�й� иЇй�иЅй�иГиЇй�
-   **ISO 8859-6** · ظ�عظ�ظ�عظ�ع ظ�عظ�ظ�ععع عظ­ععع ظ�عظ�عظ�ظ�ع
-   **CP 852** · ěž┘äěąě╣┘äěž┘ć ěž┘äě╣ěž┘ä┘ů┘ë ┘äěş┘é┘ł┘é ěž┘äěą┘ćě│ěž┘ć
-   **CP 866** · ╪з┘Д╪е╪╣┘Д╪з┘Ж ╪з┘Д╪╣╪з┘Д┘Е┘Й ┘Д╪н┘В┘И┘В ╪з┘Д╪е┘Ж╪│╪з┘Ж
-   **Mac Arabic** · ظ'عÑظ٪ظ٩عÑظ'عÜ ظ'عÑظ٩ظ'عÑعÖعâ عÑظ-عÇعàعÇ ظ'عÑظ٪عÜظ٣ظ'عÜ
-   **Mac Roman** · ÿßŸÑÿ•ÿπŸÑÿßŸÜ ÿßŸÑÿπÿßŸÑŸÖŸâ ŸÑÿ≠ŸÇŸàŸÇ ÿßŸÑÿ•ŸÜÿ≥ÿßŸÜ
-   **Mac Arabic** · **Mac Roman** · «‰≈Ÿ‰«Ê†«‰Ÿ«‰ÂÈ†‰Õ‚Ë‚†«‰≈Ê”«Ê
-   **Windows-1256** · **Mac Roman** · «·≈⁄·«‰ «·⁄«·„Ï ·ÕﬁÊﬁ «·≈‰”«‰
-   **Windows-1252** · ÇáÅÚáÇä ÇáÚÇáãì áÍÞæÞ ÇáÅäÓÇä

-   **Hebrew example** · **Browser rendering** · **Source encoding** · **Target encoding** · **Result**
-   / (That's how a blasting cap fell on a little / chick that pushed Tzvi into the water.) · כך התרסק נפץ על גוזל קטן שדחף את צבי למים · **UTF-8** · **KOI8-R** · в⌡в в■в╙в╗в║в╖ в═в╓в╔ в╒в° в▓в∙в√в° в╖в≤в÷ в╘в⌠в≈вё в░в╙ в╕в▒в≥ в°в·в≥в²
-   **Windows-1250** · ×›×š ×”×Ş×¨×ˇ×§ × ×¤×Ą ×˘×ś ×’×•×–×ś ×§××ź ×©×“×—×Ł ××Ş ×¦×‘×™ ×ś×ž×™×ť
-   **Windows-1251** · Ч›Чљ Ч”ЧЄЧЁЧЎЧ§ Ч Ч¤ЧҐ ЧўЧњ Ч’Ч•Ч–Чњ Ч§ЧЧџ Ч©Ч“Ч—ЧЈ ЧђЧЄ Ч¦Ч‘Ч™ ЧњЧћЧ™Чќ
-   **Windows-1252** · ×›×š ×”×ª×¨×¡×§ × ×¤×¥ ×¢×œ ×’×•×–×œ ×§×˜×Ÿ ×©×“×—×£ ××ª ×¦×‘×™ ×œ×ž×™×
-   **Windows-1255** · ׳›׳ ׳”׳×׳¨׳¡׳§ ׳ ׳₪׳¥ ׳¢׳ ׳’׳•׳–׳ ׳§׳˜׳ ׳©׳“׳—׳£ ׳׳× ׳¦׳‘׳™ ׳׳׳™׳
-   **Windows-1256** · ×›×ڑ ×”×ھ×¨×،×§ × ×¤×¥ ×¢×œ ×’×•×–×œ ×§×ک×ں ×©×“×—×£ ×گ×ھ ×¦×‘×™ ×œ××™×

The examples in this article do not have UTF-8 as browser setting, because UTF-8 is easily recognisable, so if a browser supports UTF-8 it should recognise it automatically, and not try to interpret something else as UTF-8.
