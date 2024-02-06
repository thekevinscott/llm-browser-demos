import { Phi } from "./phi";

export async function generate({
  weightsURL,
  modelID,
  tokenizerURL,
  configURL,
  quantized,
  prompt,
  temp = 0.5,
  top_p = 1,
  repeatPenalty = 1.1,
  seed = Math.round(Math.random() * 9999999999),
  maxSeqLen = 128,
}: {
  weightsURL: string;
  modelID: string;
  tokenizerURL: string;
  configURL: string;
  quantized: boolean;
  prompt: string;
  temp?: number,
  top_p?: number,
  repeatPenalty?: number,
  seed?: number,
  maxSeqLen?: number,

}, callback: (data: any) => void, controller: AbortController,) {
  try {
    if (!Number.isInteger(seed)) {
      throw new Error(`Seed must be an integer, got ${seed}`)
    }
    callback({ status: "loading", message: "Starting Phi" });
    const model = await Phi.getInstance(
      weightsURL,
      modelID,
      tokenizerURL,
      configURL,
      quantized,
      callback,
    );

    callback({ status: "loading", message: "Initializing model" });
    const firstToken = model.init_with_prompt(
      prompt,
      temp,
      top_p,
      repeatPenalty,
      64,
      BigInt(seed)
    );
    const seq_len = 2048;

    let sentence = firstToken;
    let maxTokens = maxSeqLen ? maxSeqLen : seq_len - prompt.length - 1;
    let startTime = performance.now();
    let tokensCount = 0;
    while (tokensCount < maxTokens) {
      await new Promise(async (resolve) => {
        if (controller && controller.signal.aborted) {
          callback({
            status: "aborted",
            message: "Aborted",
            output: prompt + sentence,
          });
          return;
        }
        const token = await model.next_token();
        if (token === "<|endoftext|>") {
          callback({
            status: "complete",
            message: "complete",
            output: prompt + sentence,
          });
          return;
        }
        const tokensSec =
          ((tokensCount + 1) / (performance.now() - startTime)) * 1000;

        sentence += token;
        callback({
          status: "generating",
          message: "Generating token",
          token: token,
          sentence: sentence,
          totalTime: performance.now() - startTime,
          tokensSec,
          prompt: prompt,
        });
        setTimeout(resolve, 0);
      });
      tokensCount++;
    }
    callback({
      status: "complete",
      message: "complete",
      output: prompt + sentence,
    });
  } catch (e) {
    console.error(e);
    callback({ error: (e as Error).message });
  }
}
