Feature: Day and night
  The site follows the visitor's clock: night begins around sunset for the season (ADR 0018).

  Scenario: After sunset in Vancouver in winter, the page is at night
    Given it is "2026-12-21T17:30:00-08:00" in "America/Vancouver"
    When I open the home page
    Then the page is at night
    And its words are a gentle grey on black, not white

  Scenario: At midday it is day
    Given it is "2026-12-21T12:00:00-08:00" in "America/Vancouver"
    When I open the home page
    Then the page is in daylight

  Scenario: A long summer evening is still day
    Given it is "2026-06-21T21:00:00-07:00" in "America/Vancouver"
    When I open the home page
    Then the page is in daylight
