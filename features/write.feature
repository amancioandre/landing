Feature: write to me
  A place to linger: Andre's prompts take turns above a roomy letter (ADR 0016), and the one being answered travels with it (ADR 0017).

  Background:
    Given time is under my control
    And I open the home page

  Scenario: A prompt waits above the letter
    Then a prompt shows above the letter

  Scenario: The prompts take turns
    When 7 seconds pass
    Then a different prompt shows above the letter

  Scenario: The prompt holds still while I write
    When I write "Hello André" in the letter
    And 20 seconds pass
    Then the same prompt still shows above the letter

  Scenario: The address is only asked for after the message
    Then the letter does not yet ask "Your email, so I can reply"

  Scenario: The keycap shows the return glyph and the word enter
    Then the letter's keycap reads "enter" beside the return glyph

  Scenario: Nothing written, nothing to ask
    When I press enter in the empty letter
    Then the letter still asks for my message

  Scenario: Message first, then where to reply
    When I write "Hello André" in the letter
    And I press enter in the letter
    Then the letter asks "Your email, so I can reply"
    And my message "Hello André" shows above it

  Scenario: A wrong address is caught
    When I write "Hello André" in the letter
    And I press enter in the letter
    And I write "not-an-email" in the letter
    And I press enter in the letter
    Then the letter says "That email doesn't look right."

  Scenario: Sending is honest until it is connected
    When I write "Hello André" in the letter
    And I press enter in the letter
    And I write "me@example.com" in the letter
    And I press enter in the letter
    Then the letter says "Sending isn't connected yet. Write to hello@andreamnc.com instead."
