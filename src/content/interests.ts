import type { IconName } from "./channels";
import type { Focus } from "../domain/interests/framing";
import type { Copy, InterestName } from "./copy/copy";
import { EN } from "./copy/en";

// The five stops on the range, in waypoint order (index 01–05). Links route each interest to its home.
export interface InterestLink { label: string; url: string; icon?: IconName }
export interface InterestStop {
  name: InterestName;                      // in English, always: anchors and Andre's letters use it
  label: string;                           // as the page shows it
  at: readonly [number, number];          // on the trail, in the original's frame
  photo?: { src: string; alt: string; focus?: Focus };   // Andre's own photographs, in black and white; focus keeps the subject in any frame
  line?: string;                           // Andre's line, still to come
  piece?: string;                          // under the card; hidden until there is content tagged for the interest
  links: readonly InterestLink[];
}

// Where each stop is and where it leads. Its words live with the rest of the page's (copy/en.ts).
type Place = Pick<InterestStop, "name" | "at" | "links"> & { photo: { src: string; focus?: Focus } };

const PLACES: readonly Place[] = [
  { name: "Engineer", at: [199, 608], photo: { src: "/img/engineer.jpg", focus: [0.55, 0.6] },
    links: [{ label: "Code on GitHub", url: "https://github.com/amancioandre", icon: "github" }] },
  { name: "Outdoorsman", at: [596, 679], photo: { src: "/img/outdoorsman.jpg", focus: [0.5, 0.3] },
    links: [{ label: "Films on YouTube", url: "https://www.youtube.com/@andre-amnc", icon: "youtube" }, { label: "@andre.amnc", url: "https://www.instagram.com/andre.amnc/", icon: "instagram" }] },
  { name: "Writer", at: [937, 742], photo: { src: "/img/writer.jpg", focus: [0.47, 0.5] },
    links: [{ label: "Stories on Substack", url: "https://andramnc.substack.com", icon: "substack" }, { label: "Patreon", url: "https://www.patreon.com/c/andreamnc", icon: "patreon" }] },
  { name: "Hunter", at: [1260, 789], photo: { src: "/img/hunter.jpg", focus: [0, 0.2] },
    links: [{ label: "Films on YouTube", url: "https://www.youtube.com/@andre-amnc", icon: "youtube" }, { label: "Stories on Substack", url: "https://andramnc.substack.com", icon: "substack" }, { label: "@gamescout.ca", url: "https://www.instagram.com/gamescout.ca", icon: "instagram" }] },
  { name: "Entrepreneur", at: [1667, 830], photo: { src: "/img/entrepreneur.jpg", focus: [0.5, 0.2] },
    links: [{ label: "Work1.ai", url: "https://work1.ai" }, { label: "Leathercase", url: "https://leathercase.app" }] },
];

/** The stops in one language: labels, lines, photo descriptions and link labels translated; places and links kept. */
export function stopsIn(copy: Copy): InterestStop[] {
  return PLACES.map(({ name, at, photo, links }) => {
    const words = copy.interests[name];
    return {
      name, label: words.label, line: words.line, at,
      photo: { ...photo, alt: words.alt },
      links: links.map((link) => ({ ...link, label: copy.links[link.label] ?? link.label })),
    };
  });
}

export const STOPS: readonly InterestStop[] = stopsIn(EN);

export const INTERESTS = STOPS.map((s) => s.name);
export type Interest = string;
