import { html, LitElement, PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import * as commonmark from 'commonmark';

@customElement('markdown-element')
export class MarkdownElement extends LitElement {
  reader = new commonmark.Parser();
  writer = new commonmark.HtmlRenderer();

  @state()
  markup = '';

  @property({ type: String })
  markdown!: string;

  protected override firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    this.renderMarkdown(this.markdown);
  }

  protected override updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (_changedProperties.has('markdown')) {
      this.renderMarkdown(this.markdown);
    }
  }

  renderMarkdown(markdown: string) {
    this.markup = this.writer.render(this.reader.parse(markdown));
  }

  override render() {
    return html`
    ${unsafeHTML(this.markup)}
    `;
  }
}
