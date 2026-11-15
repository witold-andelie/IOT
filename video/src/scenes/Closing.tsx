import { AbsoluteFill } from "remotion";
import { Background, C, Reveal, TrafficLight } from "../ui";

export const Closing = () => (
  <Background>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 34 }}>
      <Reveal at={-0.4}>
        <TrafficLight size={44} />
      </Reveal>
      <Reveal at={0} style={{ textAlign: "center" }}>
        <div style={{ fontSize: 110, fontWeight: 800, letterSpacing: -2 }}>Smart Classroom Ventilation</div>
        <div style={{ fontSize: 52, color: C.muted, marginTop: 10 }}>Fresh air, made visible.</div>
      </Reveal>
      <Reveal at={1.3} style={{ display: "flex", gap: 56, marginTop: 20 }}>
        {["Zongyuan Chi", "Lijie Luo", "Jingyi Liu", "Wentao Ma"].map((name) => (
          <div key={name} style={{ fontSize: 42, fontWeight: 600 }}>{name}</div>
        ))}
      </Reveal>
      <Reveal at={2.2} style={{ fontSize: 34, color: C.blue, fontWeight: 600 }}>
        github.com/witold-andelie/IOT
      </Reveal>
      <Reveal at={3.0} style={{ fontSize: 56, fontWeight: 700, marginTop: 24 }}>
        Thank you for watching
      </Reveal>
    </AbsoluteFill>
  </Background>
);
