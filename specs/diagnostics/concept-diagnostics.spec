Diagnostics on concept file
===========================
tags: no-lang-runner
Get all parse errors
-----------------------------
* open "data/parse-errors/concepts" and verify diagnostics with no runner

   |line|range_start|range_end|severity|message                                         |uri                                               |
   |----|-----------|---------|--------|------------------------------------------------|--------------------------------------------------|
   |0   |0          |10000    |1       |Concept should have atleast one step            |/specs/concepts/conceptShouldHaveOneStep.cpt      |
   |0   |0          |10000    |1       |Step is not defined inside a concept heading    |/specs/concepts/stepNotInConcept.cpt              |
   |0   |0          |10000    |1       |Scenario Heading is not allowed in concept file |/specs/concepts/scenarioHeadingNotAllowed.cpt     |
   |0   |0          |10000    |1       |Concept heading can have only Dynamic Parameters|/specs/concepts/headingToHaveOnlyDynamicParams.cpt|
   |1   |0          |10000    |1       |Table doesn't belong to any step                |/specs/concepts/tableDoesNotBelongToAnyStep.cpt   |
* ensure diagnostics verified
___
* stop gauge daemon