// Where an interest's card hangs on the range: above its waypoint, its edge on the tether. It tries the right of the
// line, then the left, and takes the first side that stays on screen and covers nothing (the index, other waypoints).
// No side clear means null: the view opens the card as a sheet instead.
// The range presents all its cards one way (placeCards): if any card can't hang, every card opens as a sheet.
export interface Box { x: number; y: number; width: number; height: number }
export interface Placement { side: "right" | "left"; left: number; top: number }

const EDGE = 16;   // keep this far from the screen's sides
const GAP = 30;    // the tether's length below the card, down to the waypoint's number
const CLEAR = 8;   // breathing room around anything the card must not cover

const overlaps = (a: Box, b: Box) =>
  a.x < b.x + b.width + CLEAR && b.x - CLEAR < a.x + a.width && a.y < b.y + b.height + CLEAR && b.y - CLEAR < a.y + a.height;

export function placeCard({ at, size, screen, top: below, obstacles }: {
  at: { x: number; y: number }; size: { width: number; height: number }; screen: { width: number; height: number };
  top: number; obstacles: readonly Box[];
}): Placement | null {
  const top = at.y - GAP - size.height;
  if (top < below) return null;
  const sides: Placement[] = [{ side: "right", left: at.x, top }, { side: "left", left: at.x - size.width, top }];
  return sides.find((p) => {
    if (p.left < EDGE || p.left + size.width > screen.width - EDGE) return false;
    const card = { x: p.left, y: p.top, width: size.width, height: size.height };
    return !obstacles.some((o) => overlaps(card, o));
  }) ?? null;
}

export interface CardToPlace { at: { x: number; y: number }; size: { width: number; height: number }; obstacles: readonly Box[] }

export function placeCards({ cards, screen, top }: {
  cards: readonly CardToPlace[]; screen: { width: number; height: number }; top: number;
}): Placement[] | null {
  const placements = cards.map((card) => placeCard({ ...card, screen, top }));
  return placements.every((p): p is Placement => p !== null) ? placements : null;
}
