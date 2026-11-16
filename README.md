# 字体百科 · 文档中心

[fontcover.com](https://fontcover.com) 的文档与术语库，用 [轻维基（lightwiki）](https://github.com/summerset-zz/lightwiki) 构建。

在线地址：**https://summerset-zz.github.io/fontcover-docs/**

## 这是什么

110 个页面，中英双语，讲字体、排版、字符编码与字体文件格式：字形术语、OpenType 表、Unicode 区块、CSS 字体加载、各操作系统与设计软件的字体行为。

内容用 markdown + frontmatter 写，构建产物是一组**可移植的静态文件** —— 没有服务器依赖、没有 SPA、没有外部 CDN。

## 内容从哪来

`docs/` 是 [fontcover-content](https://github.com/summerset-zz/fontcover-content) 里 `docs/` 的快照。

那个仓库是内容的生产现场（抓取、家族数据、署名台账都在那儿），本仓库只负责「发布」这一件事。同步由维护者用一条命令完成：

```bash
robocopy ../fontcover-content/docs docs /MIR
```

## 本地预览

需要先拿到工具（还没发布到 npm）：

```bash
git clone https://github.com/summerset-zz/lightwiki.git ../lightwiki
cd ../lightwiki
yarn install
yarn wiki dev ../fontcover-docs      # 预览，默认 http://127.0.0.1:5173
yarn wiki build ../fontcover-docs    # 构建，产物在 ./dist
```

## 许可

- 站点代码与主题：MIT（来自轻维基）
- 内容：见页面 frontmatter 的 `license` 与「小节来源」，逐页标注了来源与协议
