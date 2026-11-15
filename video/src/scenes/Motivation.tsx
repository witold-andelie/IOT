import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background, C, Co2, Reveal, SceneTitle, useAt } from "../ui";

const MIN = 400;
const MAX = 1700;

/** CO₂ counter that rises during the scene, coloured by the thresholds. */
const Co2Meter = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = useAt(5.7);
  const end = useAt(19);
  const ppm = Math.round(
    interpolate(frame, [start, end], [450, 1560], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    }),
  );
  const color = ppm < 1000 ? C.good : ppm <= 1400 ? C.warn : C.crit;
  const pos = (v: number) => ((v - MIN) / (MAX - MIN)) * 100;
  const limitOpacity = interpolate(frame, [useAt(10), useAt(10) + fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ width: 760 }}>
      <div style={{ fontSize: 34, color: C.muted, fontWeight: 600 }}>
        <Co2 /> in the classroom
      </div>
      <div
        style={{
          fontSize: 190,
          fontWeight: 800,
          color,
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1.05,
        }}
      >
        {ppm}
        <span style={{ fontSize: 64, color: C.muted, marginLeft: 16 }}>ppm</span>
      </div>
      <div
        style={{
          position: "relative",
          height: 28,
          borderRadius: 14,
          backgroundColor: C.card,
          border: `2px solid ${C.border}`,
          marginTop: 24,
        }}
      >
        <div
          style={{
            width: `${pos(ppm)}%`,
            height: "100%",
            borderRadius: 14,
            backgroundColor: color,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${pos(1500)}%`,
            top: -22,
            bottom: -22,
            width: 4,
            backgroundColor: C.text,
            opacity: limitOpacity,
          }}
        />
      </div>
      <div
        style={{
          position: "relative",
          height: 50,
          opacity: limitOpacity,
          fontSize: 28,
          color: C.text,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `${pos(1500)}%`,
            translate: "-50% 0px",
            top: 30,
            whiteSpace: "nowrap",
            fontWeight: 600,
          }}
        >
          1,500 ppm: Czech limit for schools
        </div>
      </div>
    </div>
  );
};

export const Motivation = () => (
  <Background>
    <SceneTitle kicker="Motivation" title="Bad air, nobody notices" />
    <AbsoluteFill
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: "160px 120px 0",
        gap: 120,
      }}
    >
      <Co2Meter />
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {[
          ["30", "students", 2.9],
          ["0", "open windows", 3.8],
          ["90", "minute lesson", 4.7],
        ].map(([num, label, at]) => (
          <Reveal key={label as string} at={at as number}>
            <div style={{ fontSize: 56, fontWeight: 700 }}>
              <span style={{ color: C.blue }}>{num}</span> {label}
            </div>
          </Reveal>
        ))}
        <Reveal at={20.3}>
          <div style={{ fontSize: 40, color: C.muted, maxWidth: 720 }}>
            High <Co2 /> makes people tired and less focused.
          </div>
        </Reveal>
        <Reveal at={25.6}>
          <div style={{ fontSize: 64, fontWeight: 800, marginTop: 12 }}>
            Nobody can see it.
          </div>
        </Reveal>
      </div>
    </AbsoluteFill>
  </Background>
);
