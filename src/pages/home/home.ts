import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import _readme from '../../../README.md?raw';

const readme = _readme.replaceAll('https://thekevinscott.github.io/llm-browser-demos', '');

@customElement('llm-home')
export class LLMApp extends LitElement {
  override render() {
    return html`
    <markdown-element markdown="${readme}"></markdown-element>
    `;
  }
}

