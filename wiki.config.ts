import type { SiteConfigInput } from '@lightwiki/schema';

/**
 * [fontcover.com](https://fontcover.com) 的文档中心。
 *
 * 内容就是本仓库的 `docs/` —— 工具在构建时临时取用（见 `.github/workflows/pages.yml`），
 * 本仓库不依赖工具的任何包，工具也不认识本仓库。
 *
 * 部署在 GitHub Pages 的项目站点下，所以 `basePath` 是仓库名；
 * 将来挪到 fontcover.com 的子路径时，只改 `siteUrl` / `basePath` 两行。
 */
const config: SiteConfigInput = {
  title: '字体百科',
  siteUrl: 'https://summerset-zz.github.io/lightwiki-demo-fontcover',
  basePath: '/lightwiki-demo-fontcover/',
  defaultLanguage: 'en',
  content: {
    en: 'docs/en',
    zh: 'docs/zh',
  },
  sections: ['basics', 'fields', 'unicode', 'scripts', 'design', 'dev', 'tools', 'reference', 'legal'],
  outputDir: 'dist',
};

export default config;
