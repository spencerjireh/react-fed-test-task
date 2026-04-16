import { describe, expect, it } from 'vitest';

import { stripHtml } from './strip-html';

describe('stripHtml', () => {
  it('removes a single tag pair', () => {
    expect(stripHtml('<p>Hello</p>')).toBe('Hello');
  });

  it('removes nested tags, preserving text + inter-tag whitespace', () => {
    expect(stripHtml('<p><b>A</b> <i>B</i></p>')).toBe('A B');
  });

  it('removes tags that have attributes', () => {
    expect(stripHtml('<a href="https://example.com">link</a>')).toBe('link');
  });

  it('removes self-closing tags', () => {
    expect(stripHtml('line 1<br />line 2')).toBe('line 1line 2');
  });

  it('returns the empty string unchanged', () => {
    expect(stripHtml('')).toBe('');
  });

  it('returns plain text unchanged', () => {
    expect(stripHtml('no tags here')).toBe('no tags here');
  });

  it('preserves HTML entities — this is a known contract, not a bug', () => {
    // `stripHtml` is a tag-stripper, not a full HTML decoder. Entities like
    // `&rsquo;` (right single quote) remain literal in the output; the raw
    // data uses the escaped form, and downstream rendering either accepts
    // the literal or handles decoding elsewhere.
    expect(stripHtml('<p>Homer&rsquo;s</p>')).toBe('Homer&rsquo;s');
  });
});
