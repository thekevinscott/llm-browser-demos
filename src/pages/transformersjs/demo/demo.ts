import { pipeline, env, TextGenerationPipeline, TextGenerationOutput, TextGenerationSingle, TextGenerationConfig } from '@xenova/transformers';

import { css, html, LitElement, PropertyValueMap } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

env.allowRemoteModels = true;
env.allowLocalModels = false;

@customElement('llm-transformersjs-demo')
export class LLMTransformersJS extends LitElement {
  static override styles = [
    css`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
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
      overflow: scroll;
      background: #CCC;
      padding: 5px;
      flex: 1;
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
  generators: Map<string, TextGenerationPipeline> = new Map();

  @query('#logs')
  logs!: HTMLPreElement;

  @query('form')
  form!: HTMLFormElement;

  @query('textarea')
  textarea!: HTMLTextAreaElement;

  @query('input[name="max_tokens"]')
  maxTokens!: HTMLInputElement;

  @query('input[name="model"]')
  model!: HTMLInputElement;

  @query('input[type="submit"]')
  submit!: HTMLInputElement;

  start?: number;

  writeLogs = (log: string) => {
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
    let generator: TextGenerationPipeline | undefined = this.generators.get(model);
    if (!generator) {
      generator = await pipeline('text-generation', model, {
        progress_callback: this.writeLogs,
      });
      this.generators.set(model, generator);
    }
    return generator;
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
      // this.generatedText = '';

      // // Construct prompt
      // const prompt = `\`\`\`py
      // import math
      // def print_prime(n):
      //     """
      //     Print all primes between 1 and n
      //     """`;

      // Generate text
      const generator = await this.getModel(this.model.value);
      const config: TextGenerationConfig = {
        max_new_tokens: parseInt(this.maxTokens.value, 10),
        callback_function: (beams) => {
          const progress = beams[0];
          const decodedText = generator.tokenizer.decode(progress.output_token_ids, {
            skip_special_tokens: true,
          });
          console.log(decodedText)
          this.textarea.value = decodedText;
          // this.generatedText = decodedText;
        },
      } as any;
      const _result = await generator(prompt, config);
      this.writeLogs('complete');
      // _result is same as decoded text above
      // console.log(result);
      // this.generatedText = result.generated_text;
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
        <input name="model" id="model" value="Xenova/phi-1_5_dev" />
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
// Xenova/phi-1_5_dev
