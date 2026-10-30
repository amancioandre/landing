// Cloudflare Turnstile, invisible: asked for a one-time pass only when a letter is sent, because passes expire.
interface Turnstile {
  render(el: HTMLElement, options: object): string;
  execute(widget: string): void;
  reset(widget: string): void;
}
declare global { interface Window { turnstile?: Turnstile } }

const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let loading: Promise<Turnstile | undefined> | undefined;
const load = () => (loading ??= new Promise((resolve) => {
  const tag = Object.assign(document.createElement("script"), { src: SCRIPT, async: true });
  tag.onload = () => resolve(window.turnstile);
  tag.onerror = () => { loading = undefined; resolve(undefined); };
  document.head.append(tag);
}));

/** Returns a way to get a fresh pass, or null when Turnstile can't be reached in time. */
export function turnstilePass(siteKey: string, patience = 10_000): () => Promise<string | null> {
  let widget: string | undefined;
  let waiting: ((pass: string | null) => void) | undefined;
  const box = document.createElement("div");

  return async () => {
    const turnstile = await load();
    if (!turnstile) return null;
    return new Promise((resolve) => {
      const timer = setTimeout(() => settle(null), patience);
      const settle = (pass: string | null) => { clearTimeout(timer); waiting = undefined; resolve(pass); };
      waiting = settle;
      if (widget === undefined) {
        document.body.append(box);
        widget = turnstile.render(box, {
          sitekey: siteKey, action: "letter", execution: "execute", appearance: "interaction-only",   // the Worker accepts only "letter" passes
          callback: (pass: string) => waiting?.(pass), "error-callback": () => waiting?.(null),
        });
      } else turnstile.reset(widget);
      turnstile.execute(widget);
    });
  };
}
