Feature: The footer says where else to find André
  The hub routes outward, so every channel names where it leads (ADR 0009), and the address is written out (ADR 0014).

  Scenario: Every channel is one click away and says where it leads
    Given I open the home page
    Then the footer links to "YouTube", "Instagram", "Substack", "LinkedIn" and "GitHub"
    And every channel link leaves for its own site

  Scenario: The address is shown, not hidden
    Given I open the home page
    Then the footer shows "hello@andreamnc.com" as a mail link
