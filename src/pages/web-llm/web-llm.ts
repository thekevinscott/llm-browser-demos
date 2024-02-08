import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import readme from './README.md?raw';
import './demo/register.js';

@customElement('llm-webllm')
export class WebLLM extends LitElement {
  static override styles = [
    css`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;
    }
    `
  ];
  override render() {
    return html`
    <markdown-element markdown="${readme}"></markdown-element>
    <llm-webllm-demo></llm-webllm-demo>
    `;
  }
}


