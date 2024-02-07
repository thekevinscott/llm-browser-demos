import { html } from 'lit';

const buildPath = (path: string) => `/${[import.meta.env.BASE_URL, path].reduce((arr, part) => {
  return arr.concat(part.split('/'))
}, []).filter(Boolean).join('/')}`;

export const ROUTES = [
  { path: buildPath(''), render: () => html`<llm-home></llm-home>` },
  { path: buildPath(`transformers.js`), render: () => html`<llm-transformersjs></llm-transformersjs>` },
  { path: buildPath(`web-llm`), render: () => html`<llm-webllm></llm-webllm>` },
  { path: buildPath(`candle`), render: () => html`<llm-candle></llm-candle>` },
  // { path: '*', render: () => html`Not Found` },
  { path: '*', render: () => html`<llm-home></llm-home>` },
];
