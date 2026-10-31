Feature: Now
  What Andre tagged `andreamnc` himself, read sideways in section 02: each card shaped by what it is (canvas row 17, B; ADR 0027).

  Background:
    Given I open the home page

  Scenario: The newest thing Andre tagged comes first
    Then the Now shows 5 cards, the first one a "Note"
    And the Now counts "01 / 05"

  Scenario: Each card takes the shape of what it is
    Then the "Story" card shows its title "The Way Back" and its opening words
    And the "Code" card shows the repo "creative-writer" in the code face
    And the "Post" card shows its words with no title

  Scenario: Each card leads to where it lives, in a new tab
    Then the "Story" card leads to "Read on Substack" at "https://andramnc.substack.com"
    And the "Code" card leads to "Code on GitHub" at "https://github.com/amancioandre/creative-writer"

  Scenario: A note with no address has no way out
    Then the first "Note" card has no link

  Scenario: The arrows move one at a time and stop at the ends
    When I ask for the next thing in the Now
    Then the Now counts "02 / 05"
    And the "Post" card is in focus
    When I ask for the previous thing in the Now
    Then the Now counts "01 / 05"
    And the Now goes no further back
    When I put the keyboard on the Now
    And I press "End"
    Then the Now goes no further on

  Scenario: The keyboard moves too
    When I put the keyboard on the Now
    And I press "End"
    Then the Now counts "05 / 05"

  Scenario: The bar leads to the Now
    Given I am on a wide screen
    Then the bar's second section is "Now", leading to the Now
