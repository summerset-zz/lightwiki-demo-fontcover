/**
 * [fontcover.com](https://fontcover.com) 的文档中心。
 *
 * 这个仓库是用 [lightwiki-starter](https://github.com/summerset-zz/lightwiki-starter)
 * 模板建起来的：目录结构、workflow、`basePath` 的处理方式都和模板一致，
 * 只是内容换成了字体百科的真实资料。
 *
 * `basePath`：GitHub Pages 的项目站点挂在 `/<仓库名>/` 下，CI 会注入仓库名
 * （见 `.github/workflows/pages.yml`）；本地预览时是 `/`。
 * 绑到 fontcover.com 的子路径时，把 `siteUrl` / `basePath` 两行改掉即可。
 *
 * 这里读 `globalThis.process.env` 而不是直接写 `process`，是为了不依赖
 * @types/node —— 内容仓库不装任何 npm 包。
 */
const env =
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

const config = {
  title: '字体百科',
  siteUrl: 'https://summerset-zz.github.io/lightwiki-demo-fontcover',
  basePath: env.LIGHTWIKI_BASE_PATH ?? '/',
  lang: 'zh',
  content: 'content/zh',
  sections: ['basics', 'fields', 'unicode', 'scripts', 'design', 'dev', 'tools', 'reference', 'legal'],
  outputDir: 'dist',
};

export default config;
