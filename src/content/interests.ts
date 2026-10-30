// The five stops on the range, in waypoint order (index 01–05).
export const INTERESTS = ["Engineer", "Outdoorsman", "Writer", "Hunter", "Entrepreneur"] as const;
export type Interest = (typeof INTERESTS)[number];
