import { describe, expect, it } from "vitest";
import { suggestion } from "./suggest";
import { LANGUAGES, ORIGINAL, languageAt } from "./languages";

const reading = (segment: string) => languageAt(segment)!;

describe("offering a reader their own language", () => {
  it("offers the translation their browser prefers", () => {
    expect(suggestion(["de-DE", "en"], ORIGINAL)?.tag).toBe("de");
  });

  it("offers nothing when they already read the page in it", () => {
    expect(suggestion(["de"], reading("de"))).toBeUndefined();
  });

  it("offers nothing when their browser prefers English on the English page", () => {
    expect(suggestion(["en-CA", "fr"], ORIGINAL)).toBeUndefined();
  });

  it("takes the first language the hub speaks, skipping the ones it doesn't", () => {
    expect(suggestion(["nl", "pl", "it-IT"], ORIGINAL)?.tag).toBe("it");
  });

  it("offers nothing when the hub speaks none of their languages", () => {
    expect(suggestion(["nl", "pl"], ORIGINAL)).toBeUndefined();
  });

  it("offers English to an English reader who landed on a translation", () => {
    expect(suggestion(["en-US"], reading("ja"))).toBe(ORIGINAL);
  });
});

describe("matching the regional languages", () => {
  it("tells Brazilian Portuguese from the rest: any Portuguese gets the Brazilian page", () => {
    expect(suggestion(["pt-BR"], ORIGINAL)?.tag).toBe("pt-BR");
    expect(suggestion(["pt-PT"], ORIGINAL)?.tag).toBe("pt-BR");
  });

  it("gives Spain the Spanish of Spain, and every other Spanish the Latin American page", () => {
    expect(suggestion(["es-ES"], ORIGINAL)?.tag).toBe("es-ES");
    expect(suggestion(["es"], ORIGINAL)?.tag).toBe("es-ES");
    expect(suggestion(["es-MX"], ORIGINAL)?.tag).toBe("es-419");
    expect(suggestion(["es-AR"], ORIGINAL)?.tag).toBe("es-419");
    expect(suggestion(["es-419"], ORIGINAL)?.tag).toBe("es-419");
  });

  it("gives Taiwan, Hong Kong and Macau the Traditional characters, and the rest Simplified", () => {
    expect(suggestion(["zh-TW"], ORIGINAL)?.tag).toBe("zh-Hant");
    expect(suggestion(["zh-HK"], ORIGINAL)?.tag).toBe("zh-Hant");
    expect(suggestion(["zh-Hant-TW"], ORIGINAL)?.tag).toBe("zh-Hant");
    expect(suggestion(["zh-CN"], ORIGINAL)?.tag).toBe("zh-Hans");
    expect(suggestion(["zh"], ORIGINAL)?.tag).toBe("zh-Hans");
  });

  it("reads tags in any letter case", () => {
    expect(suggestion(["ZH-tw"], ORIGINAL)?.tag).toBe("zh-Hant");
  });
});

describe("the reader's own choice", () => {
  it("offers nothing once they have chosen a language themselves", () => {
    expect(suggestion(["de"], ORIGINAL, { chosen: true })).toBeUndefined();
  });

  it("only ever offers a language the hub lists", () => {
    for (const tag of ["fr-CA", "uk-UA", "ru-RU", "ko-KR", "ja-JP"])
      expect(LANGUAGES).toContain(suggestion([tag], ORIGINAL));
  });
});
