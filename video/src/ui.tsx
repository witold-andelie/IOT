import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { LEAD } from "./timing";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "latin-ext"],
});

export const C = {
  bg: "#0b1220",
  bg2: "#13203b",
  card: "#16223d",
  border: "#2a3b63",
  text: "#f2f4f8",
  muted: "#a6b0c3",
  blue: "#3987e5",
  good: "#0ca30c",
  warn: "#fab219",
  crit: "#d03b3b",
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

/** Frame at which something should appear: `at` seconds after the narration starts. */
export const useAt = (at: number) => {
  const { fps } = useVideoConfig();
  return Math.round((LEAD + at) * fps);
};

/** Fades and slides its children in, `at` seconds after the narration starts. */
export const Reveal: React.FC<{
  readonly at: number;
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
  readonly dy?: number;
}> = ({ at, children, style, dy = 32 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = useAt(at);
  return (
    <div
      style={{
        opacity: interpolate(frame, [start, start + 0.5 * fps], [0, 1], clamp),
        translate: interpolate(
          frame,
          [start, start + 0.8 * fps],
          [`0px ${dy}px`, "0px 0px"],
          { ...clamp, easing: easeOut },
        ),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Dark background shared by all scenes. */
export const Background: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 20% 15%, ${C.bg2} 0%, ${C.bg} 60%)`,
      color: C.text,
      fontFamily,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Small label + headline in the top left corner of a scene. */
export const SceneTitle: React.FC<{
  readonly kicker: string;
  readonly title: string;
}> = ({ kicker, title }) => (
  <Reveal at={-0.5} style={{ position: "absolute", left: 120, top: 90 }}>
    <div
      style={{
        fontSize: 30,
        fontWeight: 600,
        color: C.blue,
        letterSpacing: 3,
        textTransform: "uppercase",
      }}
    >
      {kicker}
    </div>
    <div style={{ fontSize: 76, fontWeight: 800, marginTop: 8 }}>{title}</div>
  </Reveal>
);

/** The three-colour traffic light used as the project's symbol. */
export const TrafficLight: React.FC<{
  readonly size?: number;
  readonly active?: "good" | "warning" | "critical";
}> = ({ size = 34, active = "good" }) => {
  const lights = [
    ["good", C.good],
    ["warning", C.warn],
    ["critical", C.crit],
  ] as const;
  return (
    <div style={{ display: "flex", gap: size * 0.5 }}>
      {lights.map(([key, color]) => (
        <div
          key={key}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: color,
            opacity: key === active ? 1 : 0.28,
            boxShadow: key === active ? `0 0 ${size}px ${color}` : "none",
          }}
        />
      ))}
    </div>
  );
};

export const Card: React.FC<{
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      backgroundColor: C.card,
      border: `2px solid ${C.border}`,
      borderRadius: 24,
      padding: "36px 40px",
      ...style,
    }}
  >
    {children}
  </div>
);

/** "CO₂" with a properly placed subscript (the Unicode ₂ sits too low in Inter). */
export const Co2 = () => (
  <span>
    CO
    <span style={{ fontSize: "0.62em", position: "relative", top: "0.18em" }}>
      2
    </span>
  </span>
);

/** Replaces every "CO₂" in a string with the <Co2 /> component. */
export const withCo2 = (text: string): React.ReactNode =>
  text.split("CO₂").flatMap((part, i) =>
    i === 0 ? [part] : [<Co2 key={i} />, part],
  );
