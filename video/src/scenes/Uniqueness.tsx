import { AbsoluteFill } from "remotion";
import { Background, C, Reveal, SceneTitle, withCo2 } from "../ui";

const points = [
  { at: 3.0, title: "Every classroom + one central dashboard", sub: "Traffic light in the room, history and statistics for the building" },
  { at: 9.6, title: "≈ €51 of hardware per room", sub: "ESP32 microcontroller + Sensirion CO₂ sensor" },
  { at: 12.6, title: "Open source, no licence fees", sub: "MQTT, Node-RED, PostgreSQL, Grafana" },
  { at: 15.6, title: "Data stays on campus", sub: "Runs on the university's own server" },
];

export const Uniqueness = () => (
  <Background>
    <SceneTitle kicker="Our solution" title="What makes it different" />
    <AbsoluteFill
      style={{
        padding: "330px 120px 0",
        display: "flex",
        flexDirection: "column",
        gap: 44,
      }}
    >
      {points.map((p) => (
        <Reveal key={p.title} at={p.at} style={{ display: "flex", gap: 36 }}>
          <div
            style={{
              width: 72,
              height: 72,
              flexShrink: 0,
              borderRadius: "50%",
              backgroundColor: C.good,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 800,
            }}
          >
            ✓
          </div>
          <div>
            <div style={{ fontSize: 52, fontWeight: 700 }}>{p.title}</div>
            <div style={{ fontSize: 34, color: C.muted, marginTop: 4 }}>
              {withCo2(p.sub)}
            </div>
          </div>
        </Reveal>
      ))}
    </AbsoluteFill>
  </Background>
);
