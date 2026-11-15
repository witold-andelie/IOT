# Video presentation

3–5 minute video for the seminar project, made with [Remotion](https://www.remotion.dev)
(videos written in React). Output: 1920×1080, 30 fps, about 4 minutes.

```
script.md                    narration text + what is shown in every scene
tts/generate.py              text-to-speech (Kokoro, voice af_heart) → public/narration/*.wav
capture/capture-demo.mjs     screenshots of the live Grafana dashboard → public/demo/
src/                         the video (React components, one file per scene in src/scenes/)
out/                         rendered MP4 (not in Git)
```

## How the video is made

1. **Narration**: write or change the text in `script.md`, then generate the audio (Python 3.10–3.12):

   ```bash
   python3 -m venv tts/.venv
   tts/.venv/bin/pip install -r tts/requirements.txt
   mkdir -p tts/models && cd tts/models
   curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
   curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
   cd ../..
   tts/.venv/bin/python tts/generate.py
   ```

   This writes one WAV per scene and `public/narration/durations.json`.
   **Every scene is as long as its narration**, so the video adapts automatically.

2. **Demo footage**: start the IoT system (`docker compose up -d` in the repository root),
   let it run for about 20 minutes so the charts have data, then:

   ```bash
   npm install
   node capture/capture-demo.mjs 60 2 now-20m   # 60 screenshots, every 2 s, last 20 min
   ```

   Requires Google Chrome. The screenshots are played back as a time-lapse in scene 6.

3. **Preview**: `npm run dev` opens Remotion Studio at http://localhost:3001
   (port 3000 is used by Grafana).

4. **Render**: `npm run render` → `out/smart-classroom-ventilation.mp4`

## Changing the video

| What | Where |
|---|---|
| Spoken text | `script.md`, then run `tts/generate.py` again |
| Pronunciation of a word | `RESPELL` / `NAMES` in `tts/generate.py` |
| Text, layout, timing of what appears on screen | `src/scenes/<Scene>.tsx` (`at={…}` = seconds after the narration of that scene starts) |
| Colours, font, shared components | `src/ui.tsx` |
| Pauses before/after narration, transition length | `src/timing.ts` |
| Camera zoom in the demo | `cams` in `src/scenes/Demo.tsx` |

## Licences

- Remotion's free license covers **individuals** and **teams of up to 3 people**
  ([license FAQ](https://www.remotion.dev/docs/license/faq)). Our team has 4 members, so the video
  is made and rendered by **one team member, Wentao Ma**, on their own computer (individual use). If more people want to work on the
  Remotion project, ask Remotion first (hi@remotion.dev) or use their paid "Creators" seat.
- Kokoro TTS model: Apache-2.0. kokoro-onnx: MIT.
