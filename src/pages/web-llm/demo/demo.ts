
import { css, html, LitElement, PropertyValueMap } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import * as webllm from "@mlc-ai/web-llm";
import config from './gh-config';
const models: Record<string, {
  "model_url": string;
  "local_id": string;
  "model_lib_url": string;
  "vram_required_MB": number;
  "low_resource_required": boolean;
  "required_features"?: string[];
}> = config.model_list.reduce((acc: any, model: any) => ({
  ...acc,
  [model.local_id]: model,
}), {});

@customElement('llm-webllm-demo')
export class LLMWebLLM extends LitElement {
  static override styles = [
    css`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    textarea {
      flex: 1;
    }

    form {
      display: flex;
      flex-direction: column;
      flex: 2;
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
  chatModules: Map<string, webllm.ChatModule> = new Map();

  @query('#logs')
  logs!: HTMLPreElement;

  @query('form')
  form!: HTMLFormElement;

  @query('textarea')
  textarea!: HTMLTextAreaElement;

  @query('input[name="max_tokens"]')
  maxTokens!: HTMLInputElement;

  @query('select[name="model"]')
  model!: HTMLInputElement;

  @query('input[type="submit"]')
  submit!: HTMLInputElement;

  start?: number;

  writeLogs = (log: any) => {
    if (this.logs) {
      if (!this.start) {
        this.start = performance.now();
      }
      const now = performance.now() - this.start;
      this.logs.innerText += now + ': ' + JSON.stringify(log) + '\n';
      this.logs.scrollTop = this.logs.scrollHeight;
    }
  };

  getModel = async (model: string) => {
    let chat: webllm.ChatModule | undefined = this.chatModules.get(model);
    if (!chat) {
      console.log('get model for', model)

      chat = new webllm.ChatModule();
      // This callback allows us to report initialization progress
      chat.setInitProgressCallback((report: webllm.InitProgressReport) => {
        this.writeLogs(report);
      });
      // const config = models[model];
      // console.log(config)
      await chat.reload(model, undefined, config);
      this.chatModules.set(model, chat);
    }
    return chat;

  }

  protected override firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    this.form.onsubmit = (e: SubmitEvent) => {
      e.preventDefault();
      this.generate(this.textarea.value);
    };
  }

  generate = async (prompt: string) => {
    this.submit.setAttribute('disabled', '');
    try {

      console.log(this.model.value);
      const chat = await this.getModel(this.model.value);


      const generateProgressCallback = (_step: number, message: string) => {
        this.textarea.value = prompt + message;
      };

      const _reply0 = await chat.generate(prompt, generateProgressCallback);

      this.writeLogs(await chat.runtimeStatsText());
      this.writeLogs('complete');
    } finally {
      this.submit.removeAttribute('disabled');

    }
  }


  override render() {
    return html`
      <pre id="logs"></pre>
      <form>
      <div class="model">
      <label for="model">Model</label>
      <select id="model" name="model">
      ${Object.entries(models).map(([id, model]) => {
      const label = `${model.local_id}`;
      return html`
        <option ?selected=${'Phi1.5-q0f16' === id} value="${id}">${label}</option>
        `;
    })}
    </select>
      </div>
      <div class="input">
      <label for="max_tokens">Max Tokens</label>
      <input type="number" name="max_tokens" id="max_tokens" value="128" />
      </div>
      <textarea>def fibonacci(n):</textarea>
      <input type="submit" />
      </form>
    `;
  }
}
