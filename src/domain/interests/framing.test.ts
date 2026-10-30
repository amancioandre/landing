import { describe, expect, it } from "vitest";
import { cropFor, objectPosition } from "./framing";

const landscape = { width: 1200, height: 900 };

describe("a photo framed on its subject, not on its centre", () => {
  it("keeps the subject in a narrower frame when he stands at the left", () => {
    const crop = cropFor(landscape, { width: 4, height: 5 }, [0, 0.5]);
    expect(crop).toEqual({ x: 0, y: 0, width: 720, height: 900 });
  });

  it("crops evenly when the focus is the centre", () => {
    const crop = cropFor(landscape, { width: 4, height: 5 }, [0.5, 0.5]);
    expect(crop.x).toBe(240);
  });

  it("shows the whole photo when the frame has its shape", () => {
    expect(cropFor(landscape, { width: 4, height: 3 }, [0.2, 0.2])).toEqual({ x: 0, y: 0, width: 1200, height: 900 });
  });

  it("frames the glyphs and the photo alike, the way CSS places it", () => {
    expect(objectPosition([0.22, 0.3])).toBe("22% 30%");
  });
});
