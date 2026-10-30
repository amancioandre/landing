Feature: write to me in the bar
  The bar types Andre's prompts; one click locks the question and puts the caret in the letter (ADR 0017).

  Background:
    Given time is under my control
    And I open the home page

  Scenario: The bar types questions
    When 2 seconds pass
    Then the bar is typing a question

  Scenario: One click locks the question and opens the letter
    When 2 seconds pass
    And I click the question in the bar
    Then the question in the bar stays whole
    And I can type straight into the bar's letter

  Scenario: Clicking away keeps my words
    When I click the question in the bar
    And I type "Hi" into the bar's letter
    And I click somewhere else on the page
    And I click the question in the bar
    Then the bar's letter still holds "Hi"
