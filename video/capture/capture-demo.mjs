// Captures the live Grafana dashboard as a sequence of screenshots for the demo scene.
// Requires the system running (docker compose up -d) and Google Chrome installed.
// Usage (from video/): node capture/capture-demo.mjs [frames] [intervalSeconds] [timeRange]
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const FRAMES = Number(process.argv[2] ?? 60);
const INTERVAL = Number(process.argv[3] ?? 2);
const RANGE = process.argv[4] ?? "now-15m";
const WIDTH = 1920;
const HEIGHT = 1200;
const OUT = new URL("../public/demo/", import.meta.url).pathname;
const URL_ = `http://localhost:3000/d/classroom-air/classroom-air-quality?orgId=1&kiosk&from=${RANGE}&to=now&refresh=10s`;

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 2,
});
await page.goto(URL_, { waitUntil: "networkidle" });
await page.waitForFunction(() => document.querySelectorAll("canvas").length >= 3, null, { timeout: 30000 });
await page.waitForTimeout(5000);

for (let i = 0; i < FRAMES; i++) {
  const file = `frame-${String(i).padStart(3, "0")}.jpg`;
  await page.screenshot({ path: OUT + file, type: "jpeg", quality: 85 });
  process.stdout.write(`\r${i + 1}/${FRAMES}`);
  await page.waitForTimeout(INTERVAL * 1000);
}
await browser.close();

writeFileSync(OUT + "manifest.json", JSON.stringify({ count: FRAMES, width: WIDTH, height: HEIGHT }, null, 2) + "\n");
console.log(`\nSaved ${FRAMES} frames to ${OUT}`);
