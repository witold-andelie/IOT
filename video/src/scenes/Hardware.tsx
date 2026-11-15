import { AbsoluteFill } from "remotion";
import { Background, C, Card, Reveal, SceneTitle, withCo2 } from "../ui";

const Chip = () => (
  <svg width="120" height="120" viewBox="0 0 120 120">
    <rect x="25" y="25" width="70" height="70" rx="8" fill={C.border} stroke={C.blue} strokeWidth="4" />
    {[35, 50, 65, 80].map((p) => (
      <g key={p} stroke={C.muted} strokeWidth="4">
        <line x1={p} y1="10" x2={p} y2="25" />
        <line x1={p} y1="95" x2={p} y2="110" />
        <line x1="10" y1={p} x2="25" y2={p} />
        <line x1="95" y1={p} x2="110" y2={p} />
      </g>
    ))}
  </svg>
);

const Sensor = () => (
  <svg width="120" height="120" viewBox="0 0 120 120">
    <rect x="20" y="20" width="80" height="80" rx="10" fill={C.border} stroke={C.blue} strokeWidth="4" />
    <circle cx="60" cy="60" r="18" fill="none" stroke={C.text} strokeWidth="4" />
    <circle cx="60" cy="60" r="6" fill={C.text} />
  </svg>
);

const LedRing = () => (
  <svg width="120" height="120" viewBox="0 0 120 120">
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return <circle key={i} cx={60 + 38 * Math.cos(a)} cy={60 + 38 * Math.sin(a)} r="10" fill={C.good} />;
    })}
  </svg>
);

const Plug = () => (
  <svg width="120" height="120" viewBox="0 0 120 120">
    <rect x="30" y="40" width="60" height="55" rx="10" fill={C.border} stroke={C.blue} strokeWidth="4" />
    <rect x="45" y="18" width="8" height="24" fill={C.muted} />
    <rect x="67" y="18" width="8" height="24" fill={C.muted} />
    <line x1="60" y1="95" x2="60" y2="115" stroke={C.muted} strokeWidth="6" />
  </svg>
);

const Case = () => (
  <svg width="120" height="120" viewBox="0 0 120 120">
    <rect x="15" y="25" width="90" height="70" rx="14" fill={C.border} stroke={C.blue} strokeWidth="4" />
    {[42, 52, 62, 72].map((y) => (
      <line key={y} x1="35" y1={y} x2="85" y2={y} stroke={C.muted} strokeWidth="4" strokeLinecap="round" />
    ))}
  </svg>
);

const parts = [
  { at: 4.1, icon: <Chip />, name: "ESP32-C3", role: "microcontroller + Wi-Fi", price: "€6" },
  { at: 5.6, icon: <Sensor />, name: "Sensirion SCD41", role: "CO₂ · temperature · humidity", price: "€30" },
  { at: 7.2, icon: <LedRing />, name: "LED ring", role: "traffic light in the room", price: "€4" },
  { at: 9.3, icon: <Plug />, name: "USB power", role: "< 0.5 W", price: "€6" },
  { at: 10.8, icon: <Case />, name: "3D-printed case", role: "with air vents", price: "€5" },
];

export const Hardware = () => (
  <Background>
    <SceneTitle kicker="Hardware (proposal)" title="One sensor node per classroom" />
    <AbsoluteFill style={{ padding: "330px 120px 0", flexDirection: "row", gap: 28 }}>
      {parts.map((p) => (
        <Reveal key={p.name} at={p.at} style={{ flex: 1 }}>
          <Card style={{ height: 480, boxSizing: "border-box", padding: "34px 22px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>{p.icon}</div>
            <div style={{ fontSize: 40, fontWeight: 800, marginTop: 20 }}>{p.name}</div>
            <div style={{ fontSize: 30, color: C.muted, marginTop: 8, minHeight: 76 }}>{withCo2(p.role)}</div>
            <div style={{ fontSize: 60, fontWeight: 800, color: C.blue, marginTop: 10 }}>{p.price}</div>
          </Card>
        </Reveal>
      ))}
    </AbsoluteFill>
    <Reveal at={12.0} style={{ position: "absolute", left: 120, right: 120, bottom: 120, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <div style={{ fontSize: 40, color: C.muted }}>
        One reading per minute · the LED works even without network
      </div>
      <div style={{ fontSize: 64, fontWeight: 800 }}>
        = <span style={{ color: C.good }}>€51</span> per room
      </div>
    </Reveal>
  </Background>
);
