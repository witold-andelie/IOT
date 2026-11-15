import narration from "../public/narration/durations.json";

export const FPS = 30;
/** Seconds of picture before the narration of a scene starts. */
export const LEAD = 0.7;
/** Seconds of picture after the narration of a scene ends. */
export const TAIL = 1.0;
/** Cross-fade between scenes. */
export const TRANSITION_FRAMES = 15;

export type SceneTiming = {
  readonly scene: number;
  readonly title: string;
  readonly file: string;
  readonly seconds: number;
  readonly frames: number;
};

// Every scene lasts as long as its narration (+ lead and tail).
// The closing slide stays on screen a little longer.
export const scenes: SceneTiming[] = narration.map((n, i) => ({
  ...n,
  frames: Math.ceil(
    (LEAD + n.seconds + (i === narration.length - 1 ? 3 : TAIL)) * FPS,
  ),
}));

export const totalFrames =
  scenes.reduce((sum, s) => sum + s.frames, 0) -
  TRANSITION_FRAMES * (scenes.length - 1);
