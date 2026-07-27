import { visit } from 'unist-util-visit';
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic';
import { createMermaidRenderer } from 'mermaid-isomorphic';

// Renders ```mermaid blocks at build time into TWO inline SVGs (light +
// dark mermaid themes); CSS shows the one matching data-theme. Requires
// `markdown.syntaxHighlight.excludeLangs: ['mermaid']` so Shiki leaves
// the code block untouched.

const FONT = "'IBM Plex Sans', system-ui, sans-serif";
const THEMES = {
  light: { theme: 'neutral' },
  dark: { theme: 'dark' },
};

let renderer;

function extractCode(node) {
  const code = node.children?.[0];
  if (
    code?.type !== 'element' ||
    code.tagName !== 'code' ||
    !(code.properties?.className ?? []).includes('language-mermaid')
  ) {
    return undefined;
  }
  return code.children
    .filter((c) => c.type === 'text')
    .map((c) => c.value)
    .join('');
}

export function rehypeMermaidDual() {
  return async (tree) => {
    const targets = [];
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'pre' || !parent || index === undefined) return;
      const code = extractCode(node);
      if (code !== undefined) targets.push({ parent, index, code });
    });
    if (targets.length === 0) return;

    renderer ??= createMermaidRenderer();
    const diagrams = targets.map((t) => t.code);
    const variants = {};
    for (const [name, config] of Object.entries(THEMES)) {
      variants[name] = await renderer(diagrams, {
        prefix: `mermaid-${name}`,
        mermaidConfig: { ...config, fontFamily: FONT },
      });
    }

    targets.forEach((target, i) => {
      const children = [];
      for (const name of Object.keys(THEMES)) {
        const result = variants[name][i];
        if (result.status !== 'fulfilled') {
          throw new Error(
            `Mermaid diagram ${i + 1} failed to render: ${result.reason}\n---\n${target.code}`
          );
        }
        children.push({
          type: 'element',
          tagName: 'div',
          properties: { className: [`mermaid-${name}`] },
          children: fromHtmlIsomorphic(result.value.svg, { fragment: true }).children,
        });
      }
      target.parent.children[target.index] = {
        type: 'element',
        tagName: 'figure',
        properties: { className: ['mermaid-figure'] },
        children,
      };
    });
  };
}
