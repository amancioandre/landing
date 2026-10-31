// Where an interest's card hangs on the range: beside its waypoint's number, held by a red line running across to
// its edge (canvas row 18, B). It tries the right of the number, then the left, and takes the first side that stays
// on screen and clear of the index; it may cover a neighbouring waypoint while it is open. Vertically it centres on
// the number, kept between the bar and the foot of the range. No side clear, or no room, means null.
// The range presents all its cards one way (placeCards): if any card can't hang, every card opens as a sheet.
export interface Box { x: number; y: number; width: number; height: number }
export interface Line { left: number; width: number; y: number }
export interface Placement { side: "right" | "left"; left: number; top: number; line: Line }
export interface CardToPlace { at: { x: number; y: number }; size: { width: number; height: number }; avoid: readonly Box[] }

const EDGE = 16;     // keep this far from the screen's sides and the range's foot
const GAP = 40;      // the line's run from the waypoint's number to the card
const NUMBER = 24;   // the number's middle, this far above the waypoint's foot
const BESIDE = 10;   // half the number's width: the line starts at its side
const CLEAR = 8;     // breathing room around anything the card must not cover

const overlaps = (a: Box, b: Box) =>
  a.x < b.x + b.width + CLEAR && b.x - CLEAR < a.x + a.width && a.y < b.y + b.height + CLEAR && b.y - CLEAR < a.y + a.height;

export function placeCard({ at, size, screen, top: bar, avoid }: CardToPlace & {
  screen: { width: number; height: number }; top: number;
}): Placement | null {
  const lowest = screen.height - EDGE - size.height;
  if (lowest < bar) return null;
  const y = at.y - NUMBER;
  const top = Math.min(lowest, Math.max(bar, y - size.height / 2));
  const right = at.x + GAP, left = at.x - GAP - size.width;
  const sides: Placement[] = [
    { side: "right", left: right, top, line: { left: at.x + BESIDE, width: GAP - BESIDE, y } },
    { side: "left", left, top, line: { left: left + size.width, width: GAP - BESIDE, y } },
  ];
  return sides.find((p) => {
    if (p.left < EDGE || p.left + size.width > screen.width - EDGE) return false;
    const card = { x: p.left, y: p.top, width: size.width, height: size.height };
    return !avoid.some((o) => overlaps(card, o));
  }) ?? null;
}

export function placeCards({ cards, screen, top }: {
  cards: readonly CardToPlace[]; screen: { width: number; height: number }; top: number;
}): Placement[] | null {
  const placements = cards.map((card) => placeCard({ ...card, screen, top }));
  return placements.every((p): p is Placement => p !== null) ? placements : null;
}
