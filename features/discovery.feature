Feature: Found and understood by search and AI answers
  The page says who André is and where his work lives, in a form search engines and AI systems read (GEO/AIO).

  Scenario: The page describes itself in Andre's words
    Given I open the home page
    Then the page's description is the first two sentences of Andre's paragraph
    And link previews carry his name, that description and a picture
    And the page names its one address, https://andreamnc.com/

  Scenario: Structured data says who he is and where his work lives
    Given I open the home page
    Then the structured data describes a person named "André Amnc"
    And it links his channels "https://www.youtube.com/@andre-amnc", "https://andramnc.substack.com" and "https://github.com/amancioandre"
    And it lists what he knows about, including "Hunting"

  Scenario: The page has one main heading, his name
    Given I open the home page
    Then the page's one main heading is "André Amnc"

  Scenario: Crawlers are welcome and know where to look
    When I read "/robots.txt"
    Then it allows every crawler and points to "https://andreamnc.com/sitemap.xml"
    When I read "/sitemap.xml"
    Then it lists "https://andreamnc.com/"

  Scenario: AI systems get a plain summary
    When I read "/llms.txt"
    Then it starts with "# André Amnc"
    And it mentions "Storytelling is the vehicle of tradition."
    And it mentions "hello@andreamnc.com"

  Scenario: Everything that matters is in the page itself, readable without JavaScript
    When I read "/"
    Then it mentions "Being my own boss has always been my dream, and also my nemesis."
    And it mentions "Films on YouTube"
    And it mentions "hunting adventures throughout British Columbia"

  Scenario: The site claims its own domain when it is hosted
    When I read "/CNAME"
    Then it starts with "andreamnc.com"

  Scenario: Visits are counted by Andre's Umami, only on his own domain
    Given I open the home page
    Then the page loads Umami for the website "67b02ce4-e3ee-4a99-85b7-88c6b0e1e7b2"
    And Umami counts visits only on "andreamnc.com"

  Scenario: The tab shows the peak from the range
    Given I open the home page
    Then the page names its icon "/favicon.svg", its fallback "/favicon.ico", its home-screen icon "/apple-touch-icon.png" and its manifest "/site.webmanifest"
    When I read "/favicon.svg"
    Then it mentions "prefers-color-scheme: dark"
    When I read "/site.webmanifest"
    Then it mentions "André Amnc"
    And "/favicon.ico", "/apple-touch-icon.png", "/icon-192.png", "/icon-512.png" and "/icon-maskable-512.png" are pictures
