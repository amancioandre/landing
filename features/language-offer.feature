Feature: The range offers a reader their own language
  A mark in the sky, opposite the index, when the reader's browser prefers a language the hub speaks (canvas row 11, C).

  Scenario: A German reader is offered the German page
    Given my browser prefers "de-DE"
    When I open the home page
    Then the range offers "Auf Deutsch lesen", leading to "/de/"

  Scenario: An English reader on the English page is offered nothing
    Given my browser prefers "en-US"
    When I open the home page
    Then the range offers no other language

  Scenario: An English reader who lands on a translation is offered English
    Given my browser prefers "en-GB"
    When I open the page at "/ja/"
    Then the range offers "Read in English", leading to "/"

  Scenario: Following the offer, the page speaks the reader's language and offers nothing more
    Given my browser prefers "zh-TW"
    When I open the home page
    And I follow the offer
    Then the page says it is written in "zh-Hant"
    And the range offers no other language

  Scenario: A reader who chooses a language themselves is not offered another
    Given my browser prefers "de-DE"
    When I open the home page
    And I choose "English" among the footer's languages
    Then the range offers no other language
