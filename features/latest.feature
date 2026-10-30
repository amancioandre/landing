Feature: Latest
  What Andre published, wherever it lives, newest first; the hub links out and mirrors it as RSS (ADR 0009).

  Background:
    Given I open the home page

  Scenario: The newest post leads, wherever it lives
    Then Latest leads with "A film title" from "YouTube"
    And then shows "The Way Back" from "Substack", dated "September 10, 2026"

  Scenario: Every entry opens where it lives
    Then every Latest entry opens its own site in a new tab

  Scenario: The hub has one feed for everything
    When I read the site's feed
    Then the feed lists "A film title" and "The Way Back"
