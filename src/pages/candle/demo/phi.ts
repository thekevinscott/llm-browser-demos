import init, { Model } from "./build/m.js";

async function fetchArrayBuffer(url: string) {
  const cacheName = "phi-mixformer-candle-cache";
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(url);
  if (cachedResponse) {
    const data = await cachedResponse.arrayBuffer();
    return new Uint8Array(data);
  }
  const res = await fetch(url, { cache: "force-cache" });
  cache.put(url, res.clone());
  return new Uint8Array(await res.arrayBuffer());
}
async function concatenateArrayBuffers(urls: string[]) {
  const arrayBuffers = await Promise.all(urls.map(url => fetchArrayBuffer(url)));

  let totalLength = arrayBuffers.reduce((acc, arrayBuffer) => acc + arrayBuffer.byteLength, 0);
  let concatenatedBuffer = new Uint8Array(totalLength);

  let offset = 0;
  arrayBuffers.forEach(buffer => {
    concatenatedBuffer.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  });
  return concatenatedBuffer;
}

export class Phi {
  static instance: Record<string, any> = {};

  static async getInstance(
    weightsURL: string | string[],
    modelID: string,
    tokenizerURL: string,
    configURL: string,
    quantized: boolean,
    callback: (data: any) => void,
  ) {
    // load individual modelID only once
    if (!this.instance[modelID]) {
      await init();

      callback({ status: "loading", message: "Loading Model" });
      const [weightsArrayU8, tokenizerArrayU8, configArrayU8] =
        await Promise.all([
          concatenateArrayBuffers(([] as string[]).concat(weightsURL)),
          fetchArrayBuffer(tokenizerURL),
          fetchArrayBuffer(configURL),
        ]);

      this.instance[modelID] = new Model(
        weightsArrayU8,
        tokenizerArrayU8,
        configArrayU8,
        quantized
      );
    }
    return this.instance[modelID];
  }
}
