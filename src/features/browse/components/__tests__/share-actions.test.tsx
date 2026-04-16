import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderApp, screen, userEvent, waitFor } from '@/testing/test-utils';

import { ShareActions } from '../share-actions';

describe('ShareActions', () => {
  const writeText = vi.fn(() => Promise.resolve());
  let openSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    writeText.mockClear();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    openSpy.mockRestore();
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
      screen.getByRole('button', { name: 'Share on Facebook' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Share' }),
    ).not.toBeInTheDocument();
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

  it('Facebook click opens the Facebook sharer with the current URL', async () => {
    renderApp(<ShareActions title="Andromeda" />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Share on Facebook' }),
    );

    expect(openSpy).toHaveBeenCalledTimes(1);
    const [openUrl] = openSpy.mock.calls[0];
    expect(openUrl).toBe(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    );
  });
});
