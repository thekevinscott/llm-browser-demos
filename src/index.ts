import { LitElement, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@lit-labs/router';
import './components';
import './pages';
import { ROUTES } from './routes';

@customElement('llm-app')
export class LLMApp extends LitElement {
  private router = new Router(this, ROUTES);

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
    return this.router.outlet();
  }
}
