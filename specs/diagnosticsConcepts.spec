Diagnostics on concept file
===========================
* start gauge daemon for project "testdata/parse-errors"
Concepts should have atleast one step
-------------------------------------
* diagnostics should contain diagnostics for "/specs/concepts/conceptShouldHaveOneStep.cpt" 

   |line|range_start|range_end|severity|message                             |
   |----|-----------|---------|--------|------------------------------------|
   |0   |0          |10000    |1       |Concept should have atleast one step|

* open file "/specs/concepts/conceptShouldHaveOneStep.cpt" and handle diagnostics for content 

   |Heading  |
   |---------|
   |# Concept|

Step not in a concept
---------------------
* diagnostics should contain diagnostics for "/specs/concepts/stepNotInConcept.cpt" 

   |line|range_start|range_end|severity|message                                     |
   |----|-----------|---------|--------|--------------------------------------------|
   |0   |0          |10000    |1       |Step is not defined inside a concept heading|

* open file "/specs/concepts/stepNotInConcept.cpt" and handle diagnostics for content 

   |Heading          |
   |-----------------|
   |* step1          |
   |# Concept Heading|
   |* step1          |
   |* step2          |

Scenario heading not allowed in concept
---------------------------------------
* diagnostics should contain diagnostics for "/specs/concepts/scenarioHeadingNotAllowed.cpt" 

   |line|range_start|range_end|severity|message                                        |
   |----|-----------|---------|--------|-----------------------------------------------|
   |0   |0          |10000    |1       |Scenario Heading is not allowed in concept file|

* open file "/specs/concepts/scenarioHeadingNotAllowed.cpt" and handle diagnostics for content 

   |Heading           |
   |------------------|
   |##Scenario heading|

Concept Heading can have only dynamic parameters
------------------------------------------------
* diagnostics should contain diagnostics for "/specs/concepts/headingToHaveOnlyDynamicParams.cpt" 

   |line|range_start|range_end|severity|message                                         |
   |----|-----------|---------|--------|------------------------------------------------|
   |0   |0          |10000    |1       |Concept heading can have only Dynamic Parameters|

* open file "/specs/concepts/headingToHaveOnlyDynamicParams.cpt" and handle diagnostics for content 

   |Heading           |
   |------------------|
   |# Concept "static"|

Table doesn't belong to any step
--------------------------------
* diagnostics should contain diagnostics for "/specs/concepts/tableDoesNotBelongToAnyStep.cpt" 

   |line|range_start|range_end|severity|message                         |
   |----|-----------|---------|--------|--------------------------------|
   |1   |0          |10000    |1       |Table doesn't belong to any step|

* open file "/specs/concepts/tableDoesNotBelongToAnyStep.cpt" and handle diagnostics for content 

   |Heading  |
   |---------|
   |# Concept|
   |         |
   |         |
   |* step1  |

Circular reference
------------------
* List of errors should be asserted irrespective of the order
* diagnostics should contain diagnostics for "/specs/concepts/circularReference.cpt" 

   |line|range_start|range_end|severity|message                                                                         |
   |----|-----------|---------|--------|---------------------------------------------------------------|
   |1   |0          |10000    |1       |Circular reference found in concept. "Concept1" => %file_uri%:5|
   |4   |0          |0    |1       |Circular reference found in concept. "Concept2" => %file_uri%:2|

* open file "/specs/concepts/tableDoesNotBelongToAnyStep.cpt" and handle diagnostics for content 

   |Heading   |
   |----------|
   |# Concept1|
   |* Concept2|
   |          |
   |# Concept2|
   |* Concept1|
