import { html } from 'lit';

export const ROUTES = [
  { path: '/', render: () => html`<llm-home></llm-home>` },
  { path: '/transformers.js', render: () => html`<llm-transformersjs></llm-transformersjs>` },
  { path: '/web-llm', render: () => html`<llm-webllm></llm-webllm>` },
  { path: '/llm.js', render: () => html`<llm-llmjs></llm-llmjs>` },
  { path: '*', render: () => html`Not Found` },
];
