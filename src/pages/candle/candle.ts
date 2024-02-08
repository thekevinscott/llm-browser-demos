import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import readme from './README.md?raw';
import './demo/register.js';

@customElement('llm-candle')
export class Candle extends LitElement {
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
    <candle-demo></candle-demo>
    `;
  }
}


