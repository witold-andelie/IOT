import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import manifest from "../../public/demo/manifest.json";
import { C, Co2, Reveal, fontFamily, useAt } from "../ui";
import { LEAD } from "../timing";

// Screenshots: manifest.width × manifest.height CSS pixels (captured at 2× resolution)
const IMG_W = manifest.width;
const IMG_H = manifest.height;
const FIT = Math.min(1920 / IMG_W, 1080 / IMG_H);

// Camera positions in screenshot coordinates. zoom 1 = whole dashboard visible.
const cams = {
  full: { cx: IMG_W / 2, cy: IMG_H / 2, zoom: 1 },
  lights: { cx: 485, cy: 190, zoom: 1.85 },
  chart: { cx: 960, cy: 480, zoom: 1.15 },
  bars: { cx: 960, cy: 1085, zoom: 1.08 },
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Dashboard = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const t = (s: number) => Math.round((LEAD + s) * fps);
  const times = [t(9.6), t(10.6), t(19.0), t(20.0), t(26.8), t(27.8)];
  const seq = [cams.full, cams.lights, cams.lights, cams.chart, cams.chart, cams.bars];
  const ease = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const cx = interpolate(frame, times, seq.map((c) => c.cx), ease);
  const cy = interpolate(frame, times, seq.map((c) => c.cy), ease);
  const zoom = interpolate(frame, times, seq.map((c) => c.zoom), ease);

  const scale = FIT * zoom;
  const w = IMG_W * scale;
  const h = IMG_H * scale;
  // Keep the screenshot covering the frame when zoomed in (no empty edges)
  const left = w <= 1920 ? (1920 - w) / 2 : Math.min(0, Math.max(1920 - w, 960 - cx * scale));
  const top = h <= 1080 ? (1080 - h) / 2 : Math.min(0, Math.max(1080 - h, 540 - cy * scale));

  const index = Math.min(
    manifest.count - 1,
    Math.floor((frame / durationInFrames) * manifest.count),
  );

  return (
    <Img
      src={staticFile(`demo/frame-${String(index).padStart(3, "0")}.jpg`)}
      style={{ position: "absolute", left, top, width: w, height: h }}
    />
  );
};

const Caption: React.FC<{
  readonly from: number;
  readonly to: number;
  readonly children: React.ReactNode;
  readonly top?: boolean;
}> = ({ from, to, children, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = useAt(from);
  const b = useAt(to);
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        [top ? "top" : "bottom"]: 70,
        opacity: interpolate(frame, [a, a + 0.4 * fps, b - 0.4 * fps, b], [0, 1, 1, 0], clamp),
        backgroundColor: "rgba(11,18,32,0.92)",
        border: `2px solid ${C.border}`,
        borderRadius: 18,
        padding: "18px 30px",
        fontSize: 40,
        fontWeight: 700,
        color: C.text,
        fontFamily,
      }}
    >
      {children}
    </div>
  );
};

export const Demo = () => (
  <AbsoluteFill style={{ backgroundColor: "#111217", fontFamily }}>
    <Dashboard />
    <Reveal at={-0.3} style={{ position: "absolute", right: 80, top: 60 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          backgroundColor: C.crit,
          borderRadius: 12,
          padding: "8px 20px",
          fontSize: 30,
          fontWeight: 800,
          color: "#fff",
        }}
      >
        ● LIVE DEMO
      </div>
    </Reveal>
    <Caption from={2.2} to={9.6}>
      Simulated sensors send the same MQTT messages as real devices
    </Caption>
    <Caption from={10.6} to={19.0}>
      One traffic light per classroom
    </Caption>
    <Caption from={20.0} to={26.8}>
      <Co2 /> rises during the lesson, drops when the window opens
    </Caption>
    <Caption from={27.8} to={36.5} top>
      Share of time each room needed fresh air
    </Caption>
  </AbsoluteFill>
);
