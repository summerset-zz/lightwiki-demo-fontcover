# 字体百科 · 文档中心（部署示例）

[fontcover.com](https://fontcover.com) 的文档快照，用来演示**用轻维基部署一个真实站点**是什么样。

在线地址：**https://summerset-zz.github.io/lightwiki-demo-fontcover/**

## 内容版本

| 项 | 值 |
|---|---|
| 来源 | fontcover.com 的文档中心 |
| 版本 | 2026-11-16 快照，对应上游内容仓库 commit `ab55cdb` |
| 规模 | 110 页（中英各 55），约 390 KB markdown |

**这是一份快照，不是内容的生产现场。** 内容在上游维护，本仓库不跟随、不同步 —— 它存在的意义是「部署示例」，不是「内容源」。

## 怎么建的

用 [lightwiki-starter](https://github.com/summerset-zz/lightwiki-starter) 模板开始的：

1. 点 **Use this template** 建仓库
2. 把模板里的 `content/zh/start.md` 换成真实内容（这里是 `content/en` 55 页 + `content/zh` 55 页）
3. 改 `wiki.config.ts` 的 `title`、`siteUrl`、`sections`
4. 仓库 Settings → Pages → Source 选 **GitHub Actions**

workflow 没改、`package.json` 没有、依赖一个没装 —— 内容仓库从头到尾只有 markdown 加一个配置文件。

## 这个示例演示了什么

- **内容仓库完全独立**：自己的 `wiki.config.ts`、自己的 `content/`，不依赖工具的任何包
- **构建不需要凭据**：CI 里 `npx @lightwiki/cli@^0.1.0 build .` 一行完事
- **部署在子路径**（`/lightwiki-demo-fontcover/`）—— 也就是 `basePath` 的真实用法
- **产物是可移植静态文件**：110 页 / 约 3 MB / 构建约 1 秒，扔进任何静态托管都能用

## 自己跑一遍

这个仓库里没有 `package.json` —— 工具是 `npx` 现取的：

```bash
npx @lightwiki/cli dev .      # 预览，默认 http://127.0.0.1:5173
npx @lightwiki/cli build .    # 构建，产物在 ./dist
```

## 内容讲什么

字体、排版、字符编码与字体文件格式：字形术语、OpenType 表、Unicode 区块、CSS 字体加载、各操作系统与设计软件的字体行为。

## 许可

- 站点代码与主题：MIT（来自 [轻维基](https://github.com/summerset-zz/lightwiki)）
- 内容：见各页 frontmatter 的 `license` 与「小节来源」，逐页标注了来源与协议
