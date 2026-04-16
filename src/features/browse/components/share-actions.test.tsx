import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderApp, screen, userEvent, waitFor } from '@/testing/test-utils';

import { ShareActions } from './share-actions';

describe('ShareActions', () => {
  const writeText = vi.fn(() => Promise.resolve());
  const share = vi.fn(() => Promise.resolve());
  let openSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    writeText.mockClear();
    share.mockClear();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    openSpy.mockRestore();
    // Remove navigator.share between tests so feature-detection tests are clean.
    Reflect.deleteProperty(navigator, 'share');
  });

  it('renders the three Figma share buttons with accessible labels', () => {
    renderApp(<ShareActions title="Andromeda" />);

    expect(
      screen.getByRole('button', { name: 'Copy link' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Share on Twitter' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Share on Messenger' }),
    ).toBeInTheDocument();
  });

  it('Link click writes the current URL to the clipboard and shows a Copied toast', async () => {
    renderApp(<ShareActions title="Andromeda" />);

    await userEvent.click(screen.getByRole('button', { name: 'Copy link' }));

    expect(writeText).toHaveBeenCalledWith(window.location.href);
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Copied');
    });
  });

  it('Twitter click opens twitter.com/intent/tweet with encoded text and URL', async () => {
    renderApp(<ShareActions title="Andromeda" />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Share on Twitter' }),
    );

    expect(openSpy).toHaveBeenCalledTimes(1);
    const [openUrl, target] = openSpy.mock.calls[0];
    expect(openUrl).toMatch(/^https:\/\/twitter\.com\/intent\/tweet\?/);
    expect(openUrl).toContain(
      encodeURIComponent('I found the perfect pet name: Andromeda'),
    );
    expect(openUrl).toContain(
      `url=${encodeURIComponent(window.location.href)}`,
    );
    expect(target).toBe('_blank');
  });

  it('Messenger click opens an fb-messenger:// share deep link', async () => {
    renderApp(<ShareActions title="Andromeda" />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Share on Messenger' }),
    );

    expect(openSpy).toHaveBeenCalledTimes(1);
    const [openUrl] = openSpy.mock.calls[0];
    expect(openUrl).toBe(
      `fb-messenger://share?link=${encodeURIComponent(window.location.href)}`,
    );
  });

  it('hides the native-share button when navigator.share is unsupported', () => {
    renderApp(<ShareActions title="Andromeda" />);

    expect(
      screen.queryByRole('button', { name: 'Share' }),
    ).not.toBeInTheDocument();
  });

  it('renders the native-share button when navigator.share exists and wires it to navigator.share()', async () => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: share,
    });

    renderApp(<ShareActions title="Andromeda" />);

    const nativeButton = screen.getByRole('button', { name: 'Share' });
    await userEvent.click(nativeButton);

    expect(share).toHaveBeenCalledWith({
      title: 'Andromeda - Pet Names',
      url: window.location.href,
    });
  });
});
