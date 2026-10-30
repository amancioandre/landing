Feature: The range
  The first screen: five interests as waypoints on one land, an index in the sky, a card for each (ADR 0002, 0011, 0013).

  Background:
    Given I open the home page

  Scenario: Five waypoints on the land, none off the edge
    Then the range shows waypoints "01" to "05" inside the screen

  Scenario: The index stands in the sky
    Then the index lists "Engineer", "Outdoorsman", "Writer", "Hunter" and "Entrepreneur"
    And the index sits in the upper half of the range

  Scenario: Choosing an interest opens its card
    When I choose "Writer" in the index
    Then the card for "Writer" opens with a link to "Stories on Substack"

  Scenario: Choosing a waypoint opens the same card
    When I choose waypoint "04"
    Then the card for "Hunter" opens with a link to "Films on YouTube"

  Scenario: Clicking away puts the card away
    When I choose "Writer" in the index
    And I click on the land away from the card
    Then no card is open

  Scenario: Past the range, the bar sits on paper
    When I scroll past the range
    Then the bar is docked on paper
