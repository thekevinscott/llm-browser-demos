import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import readme from './README.md?raw';
import './demo/register.js';

@customElement('llm-webllm')
export class WebLLM extends LitElement {
  override render() {
    return html`
    <markdown-element markdown="${readme}"></markdown-element>
    <llm-webllm-demo></llm-webllm-demo>
    `;
  }
}


