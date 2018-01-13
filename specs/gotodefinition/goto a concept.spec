Goto a concept
==============
tags: no-lang-runner
* start gauge daemon for project "data/gotodefinition"
Go to the definition of a concept from the usage
------------------------------------------------
* open file "/specs/concept_definition.spec"
* goto definition of "Concept2" in "/specs/concept_definition.spec" at "4" and "4" should give details 

   |uri                       |line|range_start|range_end|
   |--------------------------|----|-----------|---------|
   |specs/concepts/concept.cpt|3   |0          |10       |
___
* stop gauge daemon
