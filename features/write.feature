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

  Scenario: A letter reaches Andre, with the question it answers
    Given letters can be delivered
    When I write "Hello André" in the letter
    And I press enter in the letter
    And I write "me@example.com" in the letter
    And I press enter in the letter
    Then the letter says "Sent. Thank you."
    And the letter that went out carries "Hello André", "me@example.com", its question and a pass that a person sent it

  Scenario: A letter tells Andre how the writer came and what they looked at
    Given letters can be delivered
    And I arrived from "https://www.youtube.com/watch?v=abc" through a link tagged "youtube" and "video"
    When I choose "Hunter" in the index
    And I write "Where do you hunt?" in the letter
    And I press enter in the letter
    And I write "me@example.com" in the letter
    And I press enter in the letter
    Then the letter says "Sent. Thank you."
    And the letter that went out notes it was written in the section, on this device, under this sky
    And the letter that went out notes I came from "https://www.youtube.com/watch?v=abc" by "youtube / video", looking at "Hunter"
    And Umami counts a letter sent from the section

  Scenario: When a letter can't go out, the address is offered
    Given letters cannot be delivered right now
    When I write "Hello André" in the letter
    And I press enter in the letter
    And I write "me@example.com" in the letter
    And I press enter in the letter
    Then the letter says "It didn't go through. Write to hello@andreamnc.com instead."
