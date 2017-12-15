Goto a concept
==============
* start gauge daemon for project "testdata/gotodefinition"
Go to the definition of a concept from the usage
------------------------------------------------
* open file "/specs/concept_definition.spec" 
* goto definition of "Concept2" in "/specs/concept_definition.spec" at "4" and "4" should give details 

   |uri                       |line|range_start|range_end|
   |--------------------------|----|-----------|---------|
   |specs/concepts/concept.cpt|3   |0          |0        |
___
* stop gauge daemon