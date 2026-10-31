Feature: Andre's words
  His lines on each interest and his paragraph about the site (.docs/copy/interest-lines.md).

  Background:
    Given I open the home page

  Scenario: Each interest carries Andre's line
    Then the range card for "Hunter" reads "It connects me with the land and with the wild, out there and in me."
    And the range card for "Writer" reads "Storytelling is the vehicle of tradition."

  Scenario: The page opens with Andre's paragraph
    Then below the range the page opens with "My way of presenting myself to the world, creatively and playfully"

  Scenario: The section names are Andre's now, no longer marked as drafts
    Then the section names "Latest" and "Now" carry no draft mark
