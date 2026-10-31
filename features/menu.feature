Feature: The menu on phones
  Below 1080px the bar's menu icon drops a panel with the sections, the interests and the channels (ADR 0019).

  Background:
    Given I am on a phone
    And I open the home page

  Scenario: The menu drops from the bar
    When I open the menu
    Then the menu offers "Latest", "Now" and "write to me"
    And the menu lists the five interests with their numbers
    And the menu links to "Patreon" and to "hello@andreamnc.com"

  Scenario: Choosing a section closes the menu and goes there
    When I open the menu
    And I choose "write to me" in the menu
    Then the menu is closed
    And the page is at "write"

  Scenario: Choosing an interest opens its card on the range
    When I open the menu
    And I choose "Hunter" in the menu
    Then the menu is closed
    And the card for "Hunter" opens with a link to "Films on YouTube"

  Scenario: Escape closes the menu
    When I open the menu
    And I press "Escape"
    Then the menu is closed

  Scenario: Wide screens keep the sections in the bar instead
    Given I am on a wide screen
    Then there is no menu icon in the bar
