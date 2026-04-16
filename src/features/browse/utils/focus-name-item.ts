export function focusNameItem(title: string): void {
  const selector = `[data-name-title="${CSS.escape(title)}"]`;
  const target = document.querySelector(selector);
  (target as HTMLElement | null)?.focus();
}
