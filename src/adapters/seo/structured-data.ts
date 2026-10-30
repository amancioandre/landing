// schema.org JSON-LD for search engines and AI answer engines: who the site is about, and where his work lives.
interface Site {
  url: string; name: string; alternateName: string; jobTitle: string;
  summary: string; knowsAbout: readonly string[]; image: string;
}

export function structuredData(site: Site, channels: readonly { url: string }[], email: string) {
  const person = `${site.url}#person`, website = `${site.url}#website`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person", "@id": person, name: site.name, alternateName: site.alternateName, url: site.url,
        jobTitle: site.jobTitle, description: site.summary, email: `mailto:${email}`, image: site.image,
        knowsAbout: [...site.knowsAbout], sameAs: channels.map((c) => c.url),
      },
      { "@type": "WebSite", "@id": website, url: site.url, name: site.name, inLanguage: "en", publisher: { "@id": person }, creator: { "@id": person } },
      { "@type": "ProfilePage", "@id": `${site.url}#page`, url: site.url, name: site.name, isPartOf: { "@id": website }, mainEntity: { "@id": person }, about: { "@id": person } },
    ],
  } as { "@context": string; "@graph": Array<Record<string, unknown>> };
}
