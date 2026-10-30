import { describe, expect, it } from "vitest";
import { LANGUAGES, alternates, languageAt, pathFor, type Language } from "./languages";

const tags = LANGUAGES.map((l) => l.tag);

describe("the languages the hub speaks", () => {
  it("speaks English first, then the twelve it was translated into", () => {
    expect(tags).toEqual(["en", "pt-BR", "es-ES", "es-419", "fr", "de", "it", "ja", "ko", "zh-Hans", "zh-Hant", "uk", "ru"]);
  });

  it("names each language in itself, so a reader finds their own", () => {
    const name = (tag: string) => LANGUAGES.find((l) => l.tag === tag)?.name;
    expect(name("ja")).toBe("日本語");
    expect(name("zh-Hant")).toBe("繁體中文");
    expect(name("uk")).toBe("Українська");
  });
});

describe("where each language lives", () => {
  it("keeps English at the root", () => {
    expect(pathFor(LANGUAGES[0])).toBe("/");
  });

  it("puts the others under their lowercase tag", () => {
    expect(pathFor(languageAt("pt-br")!)).toBe("/pt-br/");
    expect(pathFor(languageAt("zh-hans")!)).toBe("/zh-hans/");
  });

  it("finds no language at a path it doesn't serve", () => {
    expect(languageAt("jp")).toBeUndefined();
  });
});

describe("telling search engines about the other languages", () => {
  it("lists every language at its full address, and English as the default", () => {
    const links = alternates("https://andreamnc.com/");
    expect(links).toHaveLength(LANGUAGES.length + 1);
    expect(links).toContainEqual({ hreflang: "de", href: "https://andreamnc.com/de/" });
    expect(links.at(-1)).toEqual({ hreflang: "x-default", href: "https://andreamnc.com/" });
  });
});

describe("a language's shape", () => {
  it("is a value: a tag and its own name", () => {
    const de: Language | undefined = languageAt("de");
    expect(de).toEqual({ tag: "de", name: "Deutsch" });
  });
});
