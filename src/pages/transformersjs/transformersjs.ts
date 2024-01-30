import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import readme from './README.md?raw';
import './demo/register.js';

@customElement('llm-transformersjs')
export class LLMTransformersJS extends LitElement {
  override render() {
    return html`
    <markdown-element markdown="${readme}"></markdown-element>
    <llm-transformersjs-demo></llm-transformersjs-demo>
    `;
  }
}


