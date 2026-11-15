import React from "react";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { LEAD, TRANSITION_FRAMES, scenes } from "./timing";
import { Opening } from "./scenes/Opening";
import { Motivation } from "./scenes/Motivation";
import { SimilarSolutions } from "./scenes/SimilarSolutions";
import { Uniqueness } from "./scenes/Uniqueness";
import { HowItWorks } from "./scenes/HowItWorks";
import { Demo } from "./scenes/Demo";
import { Hardware } from "./scenes/Hardware";
import { Costs } from "./scenes/Costs";
import { Closing } from "./scenes/Closing";

// Order must match the scenes in video/script.md
const sceneComponents: React.FC[] = [
  Opening,
  Motivation,
  SimilarSolutions,
  Uniqueness,
  HowItWorks,
  Demo,
  Hardware,
  Costs,
  Closing,
];

export const Main = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1220" }}>
      <TransitionSeries>
        {scenes.map((scene, i) => {
          const Scene = sceneComponents[i];
          return (
            <React.Fragment key={scene.file}>
              {i > 0 ? (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                />
              ) : null}
              <TransitionSeries.Sequence
                name={scene.title}
                durationInFrames={scene.frames}
              >
                <Scene />
                <Sequence from={Math.round(LEAD * fps)} name="Narration">
                  <Audio src={staticFile(scene.file)} />
                </Sequence>
              </TransitionSeries.Sequence>
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
