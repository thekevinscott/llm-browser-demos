import { html } from 'lit';

export const ROUTES = [
  { path: '/', render: () => html`<llm-home></llm-home>` },
  { path: '/transformers.js', render: () => html`<llm-transformersjs></llm-transformersjs>` },
  { path: '/web-llm', render: () => html`<llm-webllm></llm-webllm>` },
  { path: '/candle', render: () => html`<llm-candle></llm-candle>` },
  { path: '*', render: () => html`Not Found` },
];
