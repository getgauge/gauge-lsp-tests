Diagnostics on concept file
===========================
* start gauge daemon for project "testdata/parse-errors-concepts"
Get all parse errors
-----------------------------
* diagnostics should contain diagnostics for "/specs/concepts/conceptShouldHaveOneStep.cpt" 

   |line|range_start|range_end|severity|message                                         |uri                                               |
   |----|-----------|---------|--------|------------------------------------------------|--------------------------------------------------|
   |0   |0          |10000    |1       |Concept should have atleast one step            |/specs/concepts/conceptShouldHaveOneStep.cpt      |
   |0   |0          |10000    |1       |Step is not defined inside a concept heading    |/specs/concepts/stepNotInConcept.cpt              |
   |0   |0          |10000    |1       |Scenario Heading is not allowed in concept file |/specs/concepts/scenarioHeadingNotAllowed.cpt     |
   |0   |0          |10000    |1       |Concept heading can have only Dynamic Parameters|/specs/concepts/headingToHaveOnlyDynamicParams.cpt|
   |1   |0          |10000    |1       |Table doesn't belong to any step                |/specs/concepts/tableDoesNotBelongToAnyStep.cpt   |

Circular reference
------------------
* List of errors should be asserted irrespective of the order
* diagnostics should contain diagnostics for "/specs/concepts/circularReference.cpt" 

   |line|range_start|range_end|severity|message                                                        |uri|
   |----|-----------|---------|--------|---------------------------------------------------------------|--|
   |1   |0          |10000    |1       |Circular reference found in concept. "Concept1" => %file_uri%:5|/specs/concepts/circularReference.cpt|
   |4   |0          |0        |1       |Circular reference found in concept. "Concept2" => %file_uri%:2|/specs/concepts/circularReference.cpt|
