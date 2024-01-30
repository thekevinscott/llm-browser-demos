import { LLM } from "./llm.js/llm.js";
import { css, html, LitElement, PropertyValueMap } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

@customElement('llm-js-demo')
export class LLMJSDemo extends LitElement {
  static override styles = [
    css`
    :host {
      display: flex;
      flex-direction: column;
    }
    textarea {
      height: 400px;
    }

    form {
      display: flex;
      flex-direction: column;
    }

    #logs {
      height: 200px;
      overflow: scroll;
      background: #CCC;
      padding: 5px;
    }

    input, textarea {
      margin: 10px 0;
    }

    input {
      max-width: 200px;
      padding: 5px;
      font-size: 16px;
    }
    `
  ];

  @query('#logs')
  logs!: HTMLPreElement;

  @query('form')
  form!: HTMLFormElement;

  @query('textarea')
  textarea!: HTMLTextAreaElement;

  @state()
  ready = true;

  start?: number;

  writeLogs = (log: string) => {
    if (this.logs) {
      if (!this.start) {
        this.start = performance.now();
      }
      const now = performance.now() - this.start;
      this.logs.innerText += now + ': ' + log + '\n';
      this.logs.scrollTop = this.logs.scrollHeight;
    }
  };

  writeResult = (result: string) => {
    this.textarea.value += result;
  }

  protected override firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    this.form.onsubmit = (e: SubmitEvent) => {
      e.preventDefault();
      this.generate(this.textarea.value);
      this.textarea.value = '';
    };
  }

  async generate(prompt: string) {
    this.ready = false;
    try {
      await loadApp(prompt, this.writeLogs, this.writeResult);
    } finally {
      this.ready = true;
    }
  }

  override render() {
    return html`
      <pre id="logs"></pre>
      <form>
      <textarea>def fibonacci(n):</textarea>
      <input type="submit" ?disabled=${!this.ready} />
      </form>
    `;
  }
}

const loadApp = (prompt: string, writeLogs: (result: any) => void, writeResult: (result: string) => void) => new Promise<void>((resolve) => {
  writeLogs('loading model...')
  const app = new LLM(
    // Type of Model
    'STARCODER',

    // Model URL
    'https://huggingface.co/rahuldshetty/ggml.js/resolve/main/starcoder.bin',

    // Model Load callback function
    (result: any) => {
      writeLogs('model loaded');
      app.run({
        prompt,
        top_k: 1
      });
    },

    // Model Result callback function
    writeResult,

    // On Model completion callback function
    (result: any) => {
      writeLogs('run complete')
      resolve();
    },
  );

});
