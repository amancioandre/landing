Feature: The range's settings
  A small panel at the range's lower right lets a visitor turn the weather, the time of day,
  the campfire, the night's ink and the ASCII itself (canvas row 21, A; Andre, 2026-10-31).

  Scenario: The settings open from an icon at the range's lower right
    Given I open the home page
    When I open the range's settings
    Then the settings offer "Fog", "Wind", "From", "Clouds", "Time", "Fire", "Smoke", "Ink", "Stars", "Glyphs", "Characters", "Contrast" and "Mist"
    And every amount starts at its middle, as the range is drawn

  Scenario: Holding night in the middle of the day
    Given it is "2026-12-21T12:00:00-08:00" in "America/Vancouver"
    And I open the home page
    When I open the range's settings
    And I choose "Night" for the time
    Then the page is at night

  Scenario: Holding day after sunset, then going back to the clock
    Given it is "2026-12-21T17:30:00-08:00" in "America/Vancouver"
    And I open the home page
    When I open the range's settings
    And I choose "Day" for the time
    Then the page is in daylight
    When I choose "My clock" for the time
    Then the page is at night

  Scenario: Escape puts the settings away
    Given I open the home page
    When I open the range's settings
    And I press Escape
    Then the settings are closed
