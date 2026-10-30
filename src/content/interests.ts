import type { IconName } from "./channels";

// The five stops on the range, in waypoint order (index 01–05). Links route each interest to its home.
export interface InterestLink { label: string; url: string; icon?: IconName }
export interface InterestStop {
  label: string;
  at: readonly [number, number];          // on the trail, in the original's frame
  photo?: { src: string; alt: string };   // Andre's own photographs (ophanim)
  line?: string;                           // Andre's line, still to come
  piece?: string;                          // a few lines in his words, read under the card (kk.org manner)
  links: readonly InterestLink[];
}

// Lines: Andre's words, 2026-10-29 (.docs/copy/interest-lines.md), grammar edits approved by him.
export const STOPS: readonly InterestStop[] = [
  { label: "Engineer",
    line: "Engineering has been my bread-winning activity, and I take great pleasure in it. There has hardly been a day that I didn't practice it, in software or problem solving, wherever I am.",
    at: [199, 608], links: [{ label: "Code on GitHub", url: "https://github.com/amancioandre", icon: "github" }] },
  { label: "Outdoorsman",
    line: "My late-life passion, and the reason I am rediscovering my life. The wilderness has been a great friend and teacher.",
    at: [596, 679], photo: { src: "/img/outdoorsman.jpg", alt: "André walking a forest track with his dog" },
    links: [{ label: "Films on YouTube", url: "https://www.youtube.com/@andre-amnc", icon: "youtube" }, { label: "@andre.amnc", url: "https://www.instagram.com/andre.amnc/", icon: "instagram" }] },
  { label: "Writer",
    line: "Writing is a means to dig deep into my life, process my experiences, and give freedom to my thoughts. Storytelling is the vehicle of tradition.",
    at: [937, 742], photo: { src: "/img/writer.jpg", alt: "A worn copy of Creation Myths by Marie-Louise von Franz" },
    links: [{ label: "Stories on Substack", url: "https://andramnc.substack.com", icon: "substack" }, { label: "Patreon", url: "https://www.patreon.com/c/andreamnc", icon: "patreon" }] },
  { label: "Hunter",
    line: "It connects me with the land and with the wild, out there and in me. Being responsible for a life, and for your own sustenance, is a practice of spiritual reverence for nature.",
    at: [1260, 789], photo: { src: "/img/hunter.jpg", alt: "André glassing a valley, rifle on his back" },
    links: [{ label: "Films on YouTube", url: "https://www.youtube.com/@andre-amnc", icon: "youtube" }, { label: "Stories on Substack", url: "https://andramnc.substack.com", icon: "substack" }] },
  { label: "Entrepreneur",
    line: "Being my own boss has always been my dream, and also my nemesis. It is a daunting and humbling experience, and it puts some perspective on bringing value to society.",
    at: [1667, 830], links: [{ label: "Work1.ai", url: "https://work1.ai" }, { label: "Leathercase", url: "https://leathercase.app" }] },
];

export const INTERESTS = STOPS.map((s) => s.label);
export type Interest = string;
