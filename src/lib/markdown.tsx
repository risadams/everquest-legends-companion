import { createElement, Fragment, type ReactNode } from 'react';

// A deliberately small markdown renderer for user-written text (backstories).
// Emits React elements directly — no HTML strings, so nothing can inject
// markup. Supported: # ## ### headings, **bold**, *italic* / _italic_,
// `code`, [text](https://…) links, - / 1. lists, > quotes, --- rules,
// and blank-line paragraphs.

const INLINE =
  /(`[^`\n]+`)|(\*\*[^\n]+?\*\*)|(\*[^*\n]+\*)|(_[^_\n]+_)|(\[[^\]\n]+\]\(https?:\/\/[^\s)]+\))/;

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let rest = text;
  let k = 0;
  while (rest.length > 0) {
    const m = rest.match(INLINE);
    if (!m || m.index === undefined) {
      out.push(rest);
      break;
    }
    if (m.index > 0) out.push(rest.slice(0, m.index));
    const tok = m[0];
    if (tok.startsWith('`')) {
      out.push(<code key={k}>{tok.slice(1, -1)}</code>);
    } else if (tok.startsWith('**')) {
      out.push(<strong key={k}>{inline(tok.slice(2, -2))}</strong>);
    } else if (tok.startsWith('*') || tok.startsWith('_')) {
      out.push(<em key={k}>{inline(tok.slice(1, -1))}</em>);
    } else {
      const lm = tok.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
      if (lm) {
        out.push(
          <a key={k} href={lm[2]} target="_blank" rel="noreferrer">
            {inline(lm[1])}
          </a>
        );
      } else {
        out.push(tok);
      }
    }
    rest = rest.slice(m.index + tok.length);
    k++;
  }
  return out;
}

export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // horizontal rule
    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      blocks.push(<hr key={key++} />);
      i++;
      continue;
    }

    // headings — # → h3 … ### → h5, so they never outrank page headings
    const h = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (h) {
      blocks.push(createElement(`h${h[1].length + 2}`, { key: key++ }, inline(h[2])));
      i++;
      continue;
    }

    // unordered list
    if (/^[-*]\s+/.test(trimmed)) {
      const items: ReactNode[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(<li key={items.length}>{inline(lines[i].trim().replace(/^[-*]\s+/, ''))}</li>);
        i++;
      }
      blocks.push(<ul key={key++}>{items}</ul>);
      continue;
    }

    // ordered list
    if (/^\d+[.)]\s+/.test(trimmed)) {
      const items: ReactNode[] = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        items.push(
          <li key={items.length}>{inline(lines[i].trim().replace(/^\d+[.)]\s+/, ''))}</li>
        );
        i++;
      }
      blocks.push(<ol key={key++}>{items}</ol>);
      continue;
    }

    // blockquote
    if (trimmed.startsWith('>')) {
      const quoted: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoted.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push(
        <blockquote key={key++}>
          <Markdown text={quoted.join('\n')} />
        </blockquote>
      );
      continue;
    }

    // paragraph: consecutive plain lines join with soft breaks
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,3}\s|[-*]\s|\d+[.)]\s|>|-{3,}$|\*{3,}$)/.test(lines[i].trim())
    ) {
      para.push(lines[i].trim());
      i++;
    }
    blocks.push(
      <p key={key++}>
        {para.map((l, j) => (
          <Fragment key={j}>
            {j > 0 && <br />}
            {inline(l)}
          </Fragment>
        ))}
      </p>
    );
  }

  return <div className="md-body">{blocks}</div>;
}
