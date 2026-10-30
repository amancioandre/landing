import { describe, expect, it } from "vitest";
import { structuredData } from "./structured-data";

const site = {
  url: "https://andreamnc.com/", name: "André Amnc", alternateName: "André Amâncio de Moraes",
  jobTitle: "Systems Engineer & AI Specialist", summary: "André Amnc's hub.", knowsAbout: ["Hunting"], image: "https://andreamnc.com/og.png",
};
const channels = [{ url: "https://github.com/amancioandre" }, { url: "https://www.linkedin.com/in/amancioandre/" }];
const data = structuredData(site, channels, "hello@andreamnc.com");
const node = (type: string) => data["@graph"].find((n) => n["@type"] === type)!;

describe("structured data (schema.org JSON-LD)", () => {
  it("gives the person and the website separate identities, the site published by the person", () => {
    expect(node("Person")["@id"]).toBe("https://andreamnc.com/#person");
    expect(node("WebSite")["@id"]).toBe("https://andreamnc.com/#website");
    expect(node("WebSite").publisher).toEqual({ "@id": "https://andreamnc.com/#person" });
    expect(node("WebSite").creator).toEqual({ "@id": "https://andreamnc.com/#person" });
  });

  it("describes the person with the names and title Andre gave", () => {
    expect(node("Person")).toMatchObject({ name: "André Amnc", alternateName: "André Amâncio de Moraes", jobTitle: "Systems Engineer & AI Specialist" });
  });

  it("links his real profiles, not bare domains", () => {
    expect(node("Person").sameAs).toEqual(["https://github.com/amancioandre", "https://www.linkedin.com/in/amancioandre/"]);
  });

  it("says what he knows about, how to reach him, and his own description", () => {
    expect(node("Person")).toMatchObject({ knowsAbout: ["Hunting"], email: "mailto:hello@andreamnc.com", description: "André Amnc's hub." });
  });

  it("marks the home page as his profile page", () => {
    expect(node("ProfilePage")).toMatchObject({ "@id": "https://andreamnc.com/#page", url: "https://andreamnc.com/", mainEntity: { "@id": "https://andreamnc.com/#person" } });
  });
});
