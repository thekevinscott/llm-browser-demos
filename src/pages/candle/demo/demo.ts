import { css, html, LitElement, PropertyValueMap } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { Phi } from './phi';
import { generate } from './generate';

const MODELS: Record<string, {
  base_url: string;
  model: string | string[];
  tokenizer: string;
  config: string;
  quantized: boolean;
  seq_len: number;
  size: string;
}> = {
  phi_1_5_q4k: {
    base_url:
      "https://huggingface.co/lmz/candle-quantized-phi/resolve/main/",
    model: "model-q4k.gguf",
    tokenizer: "tokenizer.json",
    config: "phi-1_5.json",
    quantized: true,
    seq_len: 2048,
    size: "800 MB",
  },
  phi_1_5_q80: {
    base_url:
      "https://huggingface.co/lmz/candle-quantized-phi/resolve/main/",
    model: "model-q80.gguf",
    tokenizer: "tokenizer.json",
    config: "phi-1_5.json",
    quantized: true,
    seq_len: 2048,
    size: "1.51 GB",
  },
  phi_2_0_q4k: {
    base_url:
      "https://huggingface.co/radames/phi-2-quantized/resolve/main/",
    model: [
      "model-v2-q4k.gguf_aa.part",
      "model-v2-q4k.gguf_ab.part",
      "model-v2-q4k.gguf_ac.part",
    ],
    tokenizer: "tokenizer.json",
    config: "config.json",
    quantized: true,
    seq_len: 2048,
    size: "1.57GB",
  },
  puffin_phi_v2_q4k: {
    base_url:
      "https://huggingface.co/lmz/candle-quantized-phi/resolve/main/",
    model: "model-puffin-phi-v2-q4k.gguf",
    tokenizer: "tokenizer-puffin-phi-v2.json",
    config: "puffin-phi-v2.json",
    quantized: true,
    seq_len: 2048,
    size: "798 MB",
  },
  puffin_phi_v2_q80: {
    base_url:
      "https://huggingface.co/lmz/candle-quantized-phi/resolve/main/",
    model: "model-puffin-phi-v2-q80.gguf",
    tokenizer: "tokenizer-puffin-phi-v2.json",
    config: "puffin-phi-v2.json",
    quantized: true,
    seq_len: 2048,
    size: "1.50 GB",
  },
};

@customElement('candle-demo')
export class CandleDemo extends LitElement {
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

  @query('input[name="max_tokens"]')
  maxTokens!: HTMLInputElement;

  @query('select[name="model"]')
  model!: HTMLSelectElement;

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
      // this.textarea.value = '';
    };
  }

  generate = async (prompt: string) => {
    const modelID = this.model.value;
    const model = MODELS[modelID];
    // console.log(model);
    const weightsURL =
      model.model instanceof Array
        ? model.model.map((m) => model.base_url + m)
        : model.base_url + model.model;
    const tokenizerURL = model.base_url + model.tokenizer;
    const configURL = model.base_url + model.config;
    let runController = new AbortController();
    await generate({
      weightsURL,
      modelID,
      tokenizerURL,
      configURL,
      quantized: model.quantized,
      prompt,
      controller: runController,
    }, (data: any) => {
      if (data.status === "generating") {
        // this.writeResult(data.token);
        this.textarea.value = `${prompt}${data.sentence}`;
      } else {
        this.writeLogs(JSON.stringify(data));
      }
    })
  }

  override render() {
    return html`
      <pre id="logs"></pre>
      <form>
      <div class="model">
      <label for="model">Model</label>
      <select id="model" name="model">
      ${Object.entries(MODELS).map(([id, model]) => {
      const label = `${id} (${model.size})`;
      return html`
        <option value="${id}">${label}</option>
        `;
    })}
      </select>
      <div class="input">
      <label for="max_tokens">Max Tokens</label>
      <input type="number" name="max_tokens" id="max_tokens" value="128" />
      </div>
      
      </div>
      <textarea>def fibonacci(n):</textarea>
      <input type="submit" ?disabled=${!this.ready} />
      </form>
    `;
  }
}
