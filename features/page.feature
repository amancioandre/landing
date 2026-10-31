Feature: The hub page
  One long page: the range first, then Latest, Now and write to me, then the footer (ADR 0009, ADR 0016).

  Scenario: The sections come in order, each with its number
    Given I open the home page
    Then the sections are "Latest", "Now" and "write to me", numbered "01", "02" and "03"

  Scenario: The name leads back to the top
    Given I open the home page
    Then the bar shows "André Amnc" linking to the top of the page

  Scenario: Writing is offered from the bar
    Given I open the home page
    Then the bar offers "write to me"
