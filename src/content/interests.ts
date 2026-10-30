import type { IconName } from "./channels";
import type { Focus } from "../domain/interests/glyph-picture";

// The five stops on the range, in waypoint order (index 01–05). Links route each interest to its home.
export interface InterestLink { label: string; url: string; icon?: IconName }
export interface InterestStop {
  label: string;
  at: readonly [number, number];          // on the trail, in the original's frame
  photo?: { src: string; alt: string; focus: Focus };   // Andre's own photographs (ophanim); focus: the element the glyphs hold
  line?: string;                           // Andre's line, still to come
  piece?: string;                          // a few lines in his words, read under the card (kk.org manner)
  links: readonly InterestLink[];
}

export const STOPS: readonly InterestStop[] = [
  { label: "Engineer", at: [199, 608], links: [{ label: "Code on GitHub", url: "https://github.com/amancioandre", icon: "github" }] },
  { label: "Outdoorsman", at: [596, 679], photo: { src: "/img/outdoorsman.jpg", alt: "André walking a forest track with his dog", focus: { cx: 0.55, cy: 0.52, rx: 0.34, ry: 0.46 } },
    links: [{ label: "Films on YouTube", url: "https://www.youtube.com/@andre-amnc", icon: "youtube" }, { label: "@andre.amnc", url: "https://www.instagram.com/andre.amnc/", icon: "instagram" }] },
  { label: "Writer", at: [937, 742], photo: { src: "/img/writer.jpg", alt: "A worn copy of Creation Myths by Marie-Louise von Franz", focus: { cx: 0.52, cy: 0.5, rx: 0.36, ry: 0.4 } },
    links: [{ label: "Stories on Substack", url: "https://andramnc.substack.com", icon: "substack" }] },
  { label: "Hunter", at: [1260, 789], photo: { src: "/img/hunter.jpg", alt: "André glassing a valley, rifle on his back", focus: { cx: 0.4, cy: 0.56, rx: 0.22, ry: 0.46 } },
    links: [{ label: "Films on YouTube", url: "https://www.youtube.com/@andre-amnc", icon: "youtube" }, { label: "Stories on Substack", url: "https://andramnc.substack.com", icon: "substack" }] },
  { label: "Entrepreneur", at: [1667, 830], links: [{ label: "Work1.ai", url: "https://work1.ai" }, { label: "Leathercase", url: "https://leathercase.app" }] },
];

export const INTERESTS = STOPS.map((s) => s.label);
export type Interest = string;
