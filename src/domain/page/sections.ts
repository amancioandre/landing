// The page's sections, numbered in order (ADR 0009). The Now takes section 02 once Andre has tagged something (ADR 0027);
// until then there is no section 02 at all: the range and its index carry the interests (Andre, 2026-10-31).
export type SectionId = "latest" | "now" | "write";
export interface Section { id: SectionId; number: string }

export function sectionsOf({ showsNow }: { showsNow: boolean }): Section[] {
  const ids: SectionId[] = showsNow ? ["latest", "now", "write"] : ["latest", "write"];
  return ids.map((id, i) => ({ id, number: String(i + 1).padStart(2, "0") }));
}
