import { describe, expect, it } from 'vitest';

import { stripHtml } from '../strip-html';

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

  it('decodes named entities (nbsp, rsquo, amp)', () => {
    expect(stripHtml('<p>Homer&rsquo;s</p>')).toBe('Homer\u2019s');
    expect(stripHtml('A&nbsp;B')).toBe('A\u00A0B');
    expect(stripHtml('Tom &amp; Jerry')).toBe('Tom & Jerry');
  });

  it('decodes trailing &nbsp; commonly left by the CMS export', () => {
    expect(stripHtml('<p>Aaron is great.&nbsp;</p>')).toBe(
      'Aaron is great.\u00A0',
    );
  });

  it('decodes numeric character references', () => {
    expect(stripHtml('&#8217;')).toBe('\u2019');
    expect(stripHtml('&#x2019;')).toBe('\u2019');
  });
});
