import { toString } from 'mdast-util-to-string';

// Estimates reading time for mixed English/CJK technical prose:
// CJK is counted per character (~300 chars/min), everything else
// per word (~200 words/min).
export function remarkReadingTime() {
  return (tree, { data }) => {
    const text = toString(tree);
    const cjk = (text.match(/[一-鿿぀-ヿ]/g) ?? []).length;
    const words = (text.replace(/[一-鿿぀-ヿ]/g, ' ').match(/\S+/g) ?? []).length;
    const minutes = Math.max(1, Math.round(cjk / 300 + words / 200));
    data.astro.frontmatter.minutesRead = minutes;
  };
}
