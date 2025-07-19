export function getHeaderHeight() {
  const header = document.querySelector('.header');

  if (!header) {
    console.warn('Header element not found.');
    return { element: null, height: 0 };
  }

  const height = header.offsetHeight;
  document.documentElement.style.setProperty('--header-height', `${height}px`);

  return { element: header, height };
}
