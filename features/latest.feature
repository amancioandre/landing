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

  Scenario: The newest post shows its own cover beside its words (canvas row 22, B)
    Given I am on a wide screen
    Then the newest post's cover sits beside its words
    And only the newest post shows a cover

  Scenario: On a phone the newest post's cover comes before its words
    Given I am on a phone
    Then the newest post's cover sits above its title
