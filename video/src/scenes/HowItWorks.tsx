import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background, C, Reveal, SceneTitle, fontFamily, useAt } from "../ui";
import { LEAD } from "../timing";

const NODE_W = 290;
const GAP = 57.5;
const LEFT = 120;
const ROW_Y = 420;
const NODE_H = 200;
const centerX = (i: number) => LEFT + NODE_W / 2 + i * (NODE_W + GAP);

const nodes = [
  { at: 1.7, title: "Sensor node", sub: "ESP32 + SCD41" },
  { at: 10.8, title: "MQTT broker", sub: "Mosquitto" },
  { at: 17.3, title: "Node-RED", sub: "validate & classify" },
  { at: 29.9, title: "PostgreSQL", sub: "store readings" },
  { at: 33.4, title: "Grafana", sub: "live dashboard" },
];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const PipelineNode: React.FC<{
  readonly index: number;
  readonly at: number;
  readonly title: string;
  readonly sub: string;
}> = ({ index, at, title, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = useAt(at);
  const on = interpolate(frame, [start, start + 0.4 * fps], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: centerX(index) - NODE_W / 2,
        top: ROW_Y,
        width: NODE_W,
        height: NODE_H,
        boxSizing: "border-box",
        borderRadius: 24,
        backgroundColor: C.card,
        border: `3px solid ${on > 0.5 ? C.blue : C.border}`,
        boxShadow: on > 0.5 ? `0 0 40px rgba(57,135,229,${0.45 * on})` : "none",
        opacity: 0.35 + 0.65 * on,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 800 }}>{title}</div>
      <div style={{ fontSize: 28, color: C.muted, marginTop: 8 }}>{sub}</div>
    </div>
  );
};

/** A dot that carries one reading from node to node. */
const Packet = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (s: number) => Math.round((LEAD + s) * fps);
  const times = [t(1.7), t(10.8), t(11.8), t(17.3), t(18.3), t(29.9), t(30.9), t(33.4), t(34.4)];
  const xs = [0, 0, 1, 1, 2, 2, 3, 3, 4].map(centerX);
  return (
    <div
      style={{
        position: "absolute",
        left: interpolate(frame, times, xs, { ...clamp, easing: Easing.inOut(Easing.cubic) }) - 18,
        top: ROW_Y - 60,
        width: 36,
        height: 36,
        borderRadius: "50%",
        backgroundColor: C.warn,
        boxShadow: `0 0 30px ${C.warn}`,
        opacity: interpolate(frame, [t(1.7), t(1.7) + 0.4 * fps], [0, 1], clamp),
      }}
    />
  );
};

export const HowItWorks = () => (
  <Background>
    <SceneTitle kicker="How it works" title="From the classroom to the dashboard" />
    <AbsoluteFill>
      {nodes.slice(0, -1).map((n, i) => (
        <div
          key={n.title}
          style={{
            position: "absolute",
            left: centerX(i) + NODE_W / 2,
            top: ROW_Y + NODE_H / 2 - 2,
            width: GAP,
            height: 4,
            backgroundColor: C.border,
          }}
        />
      ))}
      {nodes.map((n, i) => (
        <PipelineNode key={n.title} index={i} {...n} />
      ))}
      <Packet />

      <Reveal at={37.3} style={{ position: "absolute", left: centerX(1) - NODE_W / 2 - 24, top: ROW_Y - 110 }}>
        <div
          style={{
            width: centerX(4) - centerX(1) + NODE_W + 48,
            height: NODE_H + 150,
            boxSizing: "border-box",
            border: `3px dashed ${C.blue}`,
            borderRadius: 32,
            padding: "14px 24px",
            fontSize: 30,
            fontWeight: 700,
            color: C.blue,
          }}
        >
          Docker · starts with one command
        </div>
      </Reveal>

      <Reveal at={10.8} style={{ position: "absolute", left: LEFT, top: 700 }}>
        <div style={{ fontSize: 26, color: C.muted, marginBottom: 10 }}>
          MQTT topic classroom/C21/telemetry
        </div>
        <div
          style={{
            fontFamily: "Menlo, monospace",
            fontSize: 28,
            backgroundColor: C.card,
            border: `2px solid ${C.border}`,
            borderRadius: 14,
            padding: "16px 20px",
          }}
        >
          {'{"room": "C21", "co2": 1102,'}
          <br />
          {' "temp": 22.4, "hum": 38.0}'}
        </div>
      </Reveal>

      <div style={{ position: "absolute", left: centerX(2) - 230, top: 700, display: "flex", flexDirection: "column", gap: 16, fontFamily }}>
        {[
          { at: 22.6, color: C.good, label: "< 1000 ppm", text: "✓ Good" },
          { at: 25.2, color: C.warn, label: "1000–1400", text: "⚠ Ventilate soon" },
          { at: 28.2, color: C.crit, label: "> 1400 ppm", text: "✕ Ventilate now" },
        ].map((r) => (
          <Reveal key={r.label} at={r.at} dy={16}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 32 }}>
              <div style={{ width: 200, color: C.muted }}>{r.label}</div>
              <div
                style={{
                  backgroundColor: r.color,
                  color: r.color === C.warn ? "#1b1b1a" : "#ffffff",
                  fontWeight: 700,
                  borderRadius: 12,
                  padding: "8px 20px",
                }}
              >
                {r.text}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </AbsoluteFill>
  </Background>
);
