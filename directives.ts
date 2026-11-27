/**
 * 两种写在 HTML 注释里的指令 —— **本站自己的实现**，不属于轻维基。
 *
 * ```
 * <!-- hint:   标题 | 内容 -->
 * <!-- source: 站点 | 标题 | 修订号 | 许可证 | 许可证地址 | 改动说明 -->
 * ```
 *
 * 数据写进 `state.env.data`，渲染完就是布局里的 `it.page.meta`。
 *
 * 为什么扫 token 而不是拿正则擀原文：围栏里的示例也是 `<!-- … -->`，
 * 正则分不清「真的是指令」和「正在演示指令」，会把文档里的例子一起吃掉。
 * 围栏在 token 流里是 `fence`，压根进不到这里。
 */

interface Token {
  type: string;
  content: string;
  attrGet(name: string): string | null;
}

export interface Hint {
  title: string;
  body: string;
  /** 归属到上方最近的带锚点标题；文件开头则为 null */
  anchor: string | null;
}

export interface SectionSource {
  site: string;
  title: string;
  revid: string;
  license: string;
  licenseUrl: string;
  changes: string;
  anchor: string | null;
}

const HINT_RE = /^\s*<!--\s*hint:\s*([\s\S]*?)-->\s*$/;
const SOURCE_RE = /^\s*<!--\s*source:\s*([\s\S]*?)-->\s*$/;

/** 按 `|` 切 n 刀，多的部分留在最后一段（改动说明里可以再出现 `|`） */
function split(raw: string, cuts: number): string[] {
  const parts: string[] = [];
  let rest = raw;
  for (let i = 0; i < cuts; i += 1) {
    const at = rest.indexOf('|');
    if (at === -1) break;
    parts.push(rest.slice(0, at).trim());
    rest = rest.slice(at + 1);
  }
  parts.push(rest.trim());
  return parts;
}

type State = { tokens: Token[]; env: { data?: Record<string, unknown> } };
type MarkdownIt = { core: { ruler: { push: (name: string, rule: (state: State) => void) => void } } };

export default function directives(md: MarkdownIt): void {
  md.core.ruler.push('fontcover:directives', (state) => {
    const data = (state.env.data ??= {});
    const hints: Hint[] = (data.hints ??= []) as Hint[];
    const sources: SectionSource[] = (data.sources ??= []) as SectionSource[];

    // 归属规则用「上方最近的带锚点标题」，和以前一样
    let anchor: string | null = null;

    for (let i = 0; i < state.tokens.length; i += 1) {
      const token = state.tokens[i];
      if (!token) continue;

      if (token.type === 'heading_open') {
        anchor = token.attrGet('id') ?? anchor;
        continue;
      }
      if (token.type !== 'html_block') continue;

      const text = token.content.trim();

      const hint = HINT_RE.exec(text);
      if (hint) {
        const [title = '', body = ''] = split(hint[1] ?? '', 1);
        hints.push({ title, body, anchor });
        state.tokens.splice(i, 1);
        i -= 1;
        continue;
      }

      const source = SOURCE_RE.exec(text);
      if (source) {
        const [site = '', title = '', revid = '', license = '', licenseUrl = '', changes = ''] =
          split(source[1] ?? '', 5);
        sources.push({ site, title, revid, license, licenseUrl, changes, anchor });
        state.tokens.splice(i, 1);
        i -= 1;
      }
    }
  });
}
