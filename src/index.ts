import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@lit-labs/router';
import './components';
import './pages';
import { ROUTES } from './routes';

@customElement('llm-app')
export class LLMApp extends LitElement {
  private router = new Router(this, ROUTES);

  override render() {
    return this.router.outlet();
  }
}
