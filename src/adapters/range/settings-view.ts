import { STARTING, withSetting, type RangeSettings } from "../../domain/range/settings";
import { showTheSky } from "../daylight/clock";

const AMOUNT_MAX = 100;   // the sliders run 0–100; the domain's amounts run 0–1

/** The range's settings panel: opens from its icon, turns the range as each control moves, and holds day or night. */
export function mountSettings(open: HTMLButtonElement, panel: HTMLFormElement, apply: (settings: RangeSettings) => void): void {
  let settings = STARTING;

  const show = (shown: boolean) => {
    panel.hidden = !shown;
    open.setAttribute("aria-expanded", String(shown));
  };
  open.addEventListener("click", () => show(Boolean(panel.hidden)));
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) { show(false); open.focus(); }
  });
  document.addEventListener("click", (e) => {
    if (!panel.hidden && !(e.target as Element).closest("[data-settings], [data-settings-open]")) show(false);
  });

  panel.addEventListener("input", (e) => {
    const input = e.target as HTMLInputElement;
    const key = input.name as keyof RangeSettings;
    const value = input.type === "range" ? Number(input.value) / AMOUNT_MAX : input.value;
    settings = withSetting(settings, key, value as never);
    if (key === "time") holdTheSky(settings.time);
    apply(settings);
  });
}

function holdTheSky(sky: RangeSettings["time"]): void {
  const root = document.documentElement;
  if (sky === "clock") delete root.dataset.sky; else root.dataset.sky = sky;
  showTheSky(root);
}
