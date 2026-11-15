import { AbsoluteFill } from "remotion";
import { Background, C, Reveal, TrafficLight } from "../ui";

export const Opening = () => (
  <Background>
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", gap: 36 }}
    >
      <Reveal at={-0.4}>
        <TrafficLight size={44} />
      </Reveal>
      <Reveal at={0} style={{ textAlign: "center" }}>
        <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: -2 }}>
          Smart Classroom Ventilation
        </div>
        <div style={{ fontSize: 48, color: C.muted, marginTop: 12 }}>
          Fresh air, made visible.
        </div>
      </Reveal>
      <Reveal at={1.6} style={{ textAlign: "center", marginTop: 40 }}>
        <div style={{ fontSize: 32, color: C.blue, fontWeight: 600 }}>
          ETEW5E Internet of Things · Czech University of Life Sciences Prague
          · ZS 2026/27
        </div>
      </Reveal>
      <Reveal at={6.5} style={{ display: "flex", gap: 56, marginTop: 16 }}>
        {["Zongyuan Chi", "Lijie Luo", "Jingyi Liu", "Wentao Ma"].map((name) => (
          <div key={name} style={{ fontSize: 44, fontWeight: 600 }}>
            {name}
          </div>
        ))}
      </Reveal>
    </AbsoluteFill>
  </Background>
);
