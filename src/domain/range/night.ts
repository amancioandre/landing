// The suggestion of a fire in the nook between 02 and 03 (ADR 0018): at night, and only where it isn't too small.
const NOOK_FROM = 1024;   // px wide: Claude's threshold for Andre's "only on bigger devices"

export const nookShown = ({ night, width }: { night: boolean; width: number }) => night && width >= NOOK_FROM;
