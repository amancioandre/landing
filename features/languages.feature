Feature: The hub speaks every major language
  The babel tower Andre asked for: the same page in each language, each at its own address, each naming itself.

  Scenario: The footer offers every language, each in its own name
    Given I open the home page
    Then the footer offers 13 languages, among them "Português (Brasil)", "日本語" and "Українська"
    And "English" is marked as the language I am reading

  Scenario Outline: A translation is the same page in its own language
    Given I open the page at "<path>"
    Then the page says it is written in "<tag>"
    And the sections are named "<latest>", "<now>" and "<write>"
    And the footer marks "<name>" as the language I am reading

    Examples:
      | path      | tag     | name                    | latest    | now        | write            |
      | /pt-br/   | pt-BR   | Português (Brasil)      | Recentes  | Agora      | escreva para mim |
      | /es-es/   | es-ES   | Español (España)        | Lo último | Ahora      | escríbeme        |
      | /es-419/  | es-419  | Español (Latinoamérica) | Lo último | Ahora      | escríbeme        |
      | /fr/      | fr      | Français                | Récent    | Maintenant | écris-moi        |
      | /de/      | de      | Deutsch                 | Neu       | Jetzt      | schreib mir      |
      | /it/      | it      | Italiano                | Ultimi    | Ora        | scrivimi         |
      | /ja/      | ja      | 日本語                  | 最新      | いま       | 手紙をください   |
      | /ko/      | ko      | 한국어                  | 최근      | 지금       | 편지 보내기      |
      | /zh-hans/ | zh-Hans | 简体中文                | 最新      | 此刻       | 给我写信         |
      | /zh-hant/ | zh-Hant | 繁體中文                | 最新      | 此刻       | 給我寫信         |
      | /uk/      | uk      | Українська              | Нове      | Зараз      | напиши мені      |
      | /ru/      | ru      | Русский                 | Новое     | Сейчас     | напиши мне       |

  Scenario: The bar types its questions in the page's language
    Given I open the page at "/de/"
    Then the bar offers "schreib mir"

  Scenario: A letter's status speaks the page's language
    Given I open the page at "/pt-br/"
    When I write "Olá" in the letter
    And I press enter in the letter
    And I write "not-an-email" in the letter
    And I press enter in the letter
    Then the letter says "Esse e-mail não parece certo."

  Scenario: Search engines are told where every language lives
    Given I open the page at "/ja/"
    Then the page points to itself at "https://andreamnc.com/ja/"
    And the page lists 13 languages and a default as alternates
