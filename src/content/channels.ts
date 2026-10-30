// Where else to find Andre (ADR 0009). Handles are facts, not copy.
export type IconName = "youtube" | "instagram" | "substack" | "linkedin" | "github" | "patreon";

export interface Channel {
  name: string;
  handle: string;
  url: string;
  icon: IconName;
}

export const CHANNELS: readonly Channel[] = [
  { name: "YouTube", handle: "@andre-amnc", url: "https://www.youtube.com/@andre-amnc", icon: "youtube" },
  { name: "Instagram", handle: "@andre.amnc", url: "https://www.instagram.com/andre.amnc/", icon: "instagram" },
  { name: "Substack", handle: "andramnc.substack.com", url: "https://andramnc.substack.com", icon: "substack" },
  { name: "LinkedIn", handle: "amancioandre", url: "https://www.linkedin.com/in/amancioandre/", icon: "linkedin" },
  { name: "GitHub", handle: "amancioandre", url: "https://github.com/amancioandre", icon: "github" },
  { name: "Patreon", handle: "andreamnc", url: "https://www.patreon.com/c/andreamnc", icon: "patreon" },
];

export const CONTACT_ADDRESS = "hello@andreamnc.com"; // ADR 0014
