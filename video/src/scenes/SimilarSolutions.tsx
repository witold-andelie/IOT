import { AbsoluteFill } from "remotion";
import { Background, C, Card, Reveal, SceneTitle, withCo2 } from "../ui";

const solutions = [
  { at: 1.2, name: "Aranet4", tag: "Portable monitor · ~€199", limit: "One room only, price per room" },
  { at: 8.4, name: "Airthings / Netatmo", tag: "Commercial device + cloud", limit: "Data stored with the vendor" },
  { at: 13.0, name: "CO₂ traffic light", tag: "DIY, German schools", limit: "No data, no central overview" },
  { at: 18.4, name: "Building management", tag: "Professional HVAC control", limit: "Needs mechanical ventilation" },
];

export const SimilarSolutions = () => (
  <Background>
    <SceneTitle kicker="Similar solutions" title="What already exists" />
    <AbsoluteFill
      style={{
        padding: "330px 120px 110px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: 40,
      }}
    >
      {solutions.map((s) => (
        <Reveal key={s.name} at={s.at} style={{ height: "100%" }}>
          <Card style={{ height: "100%", boxSizing: "border-box" }}>
            <div style={{ fontSize: 58, fontWeight: 800 }}>{withCo2(s.name)}</div>
            <div style={{ fontSize: 38, color: C.muted, marginTop: 8 }}>
              {s.tag}
            </div>
            <div
              style={{ fontSize: 42, marginTop: 40, color: C.text, fontWeight: 600 }}
            >
              <span style={{ color: C.crit, marginRight: 14 }}>✕</span>
              {s.limit}
            </div>
          </Card>
        </Reveal>
      ))}
    </AbsoluteFill>
  </Background>
);
