/** The phone menu (ADR 0019): the icon drops the panel; choosing anything, the icon, Escape or a tap outside closes it. */
export function mountMenu(bar: HTMLElement): void {
  const button = bar.querySelector<HTMLButtonElement>("[data-menu-button]")!;
  const panel = bar.querySelector<HTMLElement>("[data-menu]")!;
  const set = (open: boolean) => {
    panel.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    bar.toggleAttribute("data-menu-open", open);
  };
  button.addEventListener("click", () => set(panel.hidden));
  panel.addEventListener("click", (e) => { if ((e.target as Element).closest("a")) set(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) { set(false); button.focus(); } });
  document.addEventListener("click", (e) => { if (!panel.hidden && !bar.contains(e.target as Node)) set(false); });
  set(false);
}
