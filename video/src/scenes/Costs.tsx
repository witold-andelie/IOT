import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Background, C, Card, Reveal, SceneTitle, useAt } from "../ui";

const Row: React.FC<{ readonly label: string; readonly value: string }> = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 40, marginTop: 18 }}>
    <span style={{ color: C.muted }}>{label}</span>
    <span style={{ fontWeight: 800 }}>{value}</span>
  </div>
);

const Bar: React.FC<{
  readonly at: number;
  readonly label: string;
  readonly value: number;
  readonly max: number;
  readonly color: string;
}> = ({ at, label, value, max, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = useAt(at);
  const grow = interpolate(frame, [start, start + 1.2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ fontSize: 32, color: C.muted, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ width: `${(value / max) * 75 * grow}%`, height: 46, borderRadius: 8, backgroundColor: color }} />
        <div style={{ fontSize: 44, fontWeight: 800, opacity: grow }}>€{value.toLocaleString("en-US")}</div>
      </div>
    </div>
  );
};

export const Costs = () => (
  <Background>
    <SceneTitle kicker="Expected costs" title="What does it cost?" />
    <AbsoluteFill style={{ padding: "310px 120px 0" }}>
      <div style={{ display: "flex", gap: 40 }}>
        <Reveal at={1.5} style={{ flex: 1 }}>
          <Card>
            <div style={{ fontSize: 44, fontWeight: 800 }}>Pilot · 3 classrooms</div>
            <Row label="Initial (hardware + installation)" value="€191" />
            <Row label="Operation, 1 year" value="€411" />
          </Card>
        </Reveal>
        <Reveal at={10.8} style={{ flex: 1 }}>
          <Card style={{ borderColor: C.blue }}>
            <div style={{ fontSize: 44, fontWeight: 800 }}>Building · 30 classrooms</div>
            <Row label="Initial (hardware + installation)" value="€1,905" />
            <Row label="Operation, 1 year" value="€810" />
          </Card>
        </Reveal>
      </div>
      <Reveal at={18.0} style={{ marginTop: 26, fontSize: 40, textAlign: "right" }}>
        ≈ <b style={{ color: C.good }}>€27</b> per classroom per year
      </Reveal>
      <div style={{ marginTop: 6 }}>
        <Bar at={20.1} label="Our system · 30 classrooms · first year in total" value={2715} max={5970} color={C.good} />
        <Bar at={21.3} label="30 × commercial monitor (Aranet4) · hardware only" value={5970} max={5970} color={C.crit} />
      </div>
    </AbsoluteFill>
    <Reveal at={24.4} style={{ position: "absolute", right: 120, bottom: 70 }}>
      <div style={{ fontSize: 40, fontWeight: 800, backgroundColor: C.card, border: `2px solid ${C.good}`, borderRadius: 16, padding: "12px 28px" }}>
        €0 licence fees · 100 % open source
      </div>
    </Reveal>
  </Background>
);
