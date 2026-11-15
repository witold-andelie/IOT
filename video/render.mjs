// Renders the video with the Node API (more reliable than `remotion render` on this machine).
// Usage (from video/): node render.mjs
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const root = path.dirname(new URL(import.meta.url).pathname);
const output = path.join(root, "out", "smart-classroom-ventilation.mp4");

const serveUrl = await bundle({
  entryPoint: path.join(root, "src", "index.ts"),
  publicDir: path.join(root, "public"),
});
const composition = await selectComposition({ serveUrl, id: "Main", timeoutInMilliseconds: 60000 });

let last = -1;
await renderMedia({
  composition,
  serveUrl,
  codec: "h264",
  outputLocation: output,
  imageFormat: "jpeg",
  jpegQuality: 90,
  timeoutInMilliseconds: 60000,
  onProgress: ({ progress }) => {
    const pct = Math.floor(progress * 100);
    if (pct !== last && pct % 5 === 0) {
      last = pct;
      console.log(`${pct}%`);
    }
  },
});
console.log(`Saved ${output}`);
