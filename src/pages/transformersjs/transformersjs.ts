import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import readme from './README.md?raw';
import './demo/register.js';

@customElement('llm-transformersjs')
export class LLMTransformersJS extends LitElement {
  static override styles = [
    css`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    `
  ];

  override render() {
    return html`
    <markdown-element markdown="${readme}"></markdown-element>
    <llm-transformersjs-demo></llm-transformersjs-demo>
    `;
  }
}


