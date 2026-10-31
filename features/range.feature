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

  Scenario: The writer can be backed on Patreon
    When I choose "Writer" in the index
    Then the card for "Writer" opens with a link to "Patreon"

  Scenario: Hunting has its own Instagram
    When I choose "Hunter" in the index
    Then the card for "Hunter" opens with a link to "@gamescout.ca"

  Scenario: Choosing a waypoint opens the same card
    When I choose waypoint "04"
    Then the card for "Hunter" opens with a link to "Films on YouTube"

  Scenario: Every card draws its line again as it opens
    Given I am on a large screen
    When I choose "Writer" in the index
    And the card has finished opening
    And I choose "Hunter" in the index
    Then its line draws in from the waypoint
    And its card fades in

  Scenario: On a medium screen a card never covers the index
    Given I am on a medium screen
    When I choose "Hunter" in the index
    Then the card does not cover the index
    When I choose "Entrepreneur" in the index
    Then the card does not cover the index

  Scenario: On a laptop screen every card hangs beside its waypoint
    Given I am on a laptop screen
    When I choose each interest in the index in turn
    Then every card hung beside its waypoint on its line

  Scenario: On a 13-inch laptop every card still hangs beside its waypoint
    Given I am on a 13-inch laptop screen
    When I choose each interest in the index in turn
    Then every card hung beside its waypoint on its line

  Scenario: On a phone every card opens as a strip at the foot
    Given I am on a phone
    When I choose each interest in the index in turn
    Then every card opened as a strip at the foot

  Scenario: Clicking away puts the card away
    When I choose "Writer" in the index
    And I click on the land away from the card
    Then no card is open

  Scenario: Past the range, the bar sits on paper
    When I scroll past the range
    Then the bar is docked on paper
