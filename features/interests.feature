Feature: Interests
  The five interests read sideways: one card in focus, the others waiting in the range's glyphs (canvas row 3).

  Background:
    Given I open the home page

  Scenario: One interest in focus, its photo showing
    Then "Outdoorsman" is the interest in focus
    And its photo shows

  Scenario: The others wait in glyphs
    Then the card for "Writer" shows its photo drawn in glyphs

  Scenario: Choosing from the index
    When I choose "Hunter" among the interests
    Then "Hunter" is the interest in focus

  Scenario: The arrows move one at a time and stop at the end
    When I choose "Entrepreneur" among the interests
    And I ask for the next interest
    Then "Entrepreneur" is the interest in focus
    When I ask for the previous interest
    Then "Hunter" is the interest in focus

  Scenario: The interest that leaves to the left stays in view, out of focus
    When I ask for the next interest
    Then "Writer" is the interest in focus
    And the card for "Outdoorsman" is still in view to the left, out of focus

  Scenario: The keyboard moves too
    When I put the keyboard on the interests
    And I press "ArrowRight"
    Then "Writer" is the interest in focus

  Scenario: Only the card in focus can be followed
    Then the links of "Writer" cannot be reached yet
    And the links of "Outdoorsman" open in a new tab
