Diagnostics on spec file
========================
tags: no-lang-runner
Get all parse errors
----------------------
* open "data/parse-errors/specs" and verify diagnostics with no runner

   |line|range_start|range_end|severity|message                                                  |uri                                |
   |----|-----------|---------|--------|---------------------------------------------------------|-----------------------------------|
   |1   |0          |10000    |1       |Multiple spec headings found in same file                |/specs/multipleSpecHeadings.spec   |
   |0   |0          |10000    |1       |Spec does not have any elements                          |/specs/specWithoutElements.spec    |
   |5   |0          |10000    |1       |Teardown should have at least three underscore characters|/specs/tearDownThreeUnderscore.spec|
   |2   |0          |10000    |1       |Scenario heading should have at least one character      |/specs/withoutScenarioHeading.spec |
   |1   |0          |10000    |1       |Scenario should have atleast one step                    |/specs/withoutScenarioHeading.spec |
___
* stop gauge daemon