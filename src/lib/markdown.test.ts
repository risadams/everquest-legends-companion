import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Markdown } from './markdown';

const html = (text: string) => renderToStaticMarkup(createElement(Markdown, { text }));

describe('Markdown renderer', () => {
  it('renders paragraphs split on blank lines, soft breaks within', () => {
    const out = html('First line.\nStill first para.\n\nSecond para.');
    expect(out).toContain('<p>First line.<br/>Still first para.</p>');
    expect(out).toContain('<p>Second para.</p>');
  });

  it('renders bold, italic, and code inline', () => {
    const out = html('A **bold** and *sly* and _quiet_ `word`.');
    expect(out).toContain('<strong>bold</strong>');
    expect(out).toContain('<em>sly</em>');
    expect(out).toContain('<em>quiet</em>');
    expect(out).toContain('<code>word</code>');
  });

  it('nests inline formatting', () => {
    expect(html('**bold with *italic* inside**')).toContain(
      '<strong>bold with <em>italic</em> inside</strong>'
    );
  });

  it('demotes headings below page level', () => {
    const out = html('# Origins\n## Youth\n### The scar');
    expect(out).toContain('<h3>Origins</h3>');
    expect(out).toContain('<h4>Youth</h4>');
    expect(out).toContain('<h5>The scar</h5>');
  });

  it('renders unordered and ordered lists', () => {
    const out = html('- fled Neriak\n- joined a crew\n\n1. first kill\n2. first bounty');
    expect(out).toContain('<ul><li>fled Neriak</li><li>joined a crew</li></ul>');
    expect(out).toContain('<ol><li>first kill</li><li>first bounty</li></ol>');
  });

  it('renders blockquotes and rules', () => {
    const out = html('> Never again.\n\n---');
    expect(out).toContain('<blockquote>');
    expect(out).toContain('Never again.');
    expect(out).toContain('<hr/>');
  });

  it('renders only http(s) links and never raw HTML', () => {
    const linked = html('[the wiki](https://eqlwiki.com/)');
    expect(linked).toContain('href="https://eqlwiki.com/"');
    expect(linked).toContain('rel="noreferrer"');

    const evil = html('[click](javascript:alert(1))');
    expect(evil).not.toContain('href');

    const injected = html('<script>alert(1)</script> & <img src=x>');
    expect(injected).not.toContain('<script>');
    expect(injected).toContain('&lt;script&gt;'); // escaped as text
  });
});
