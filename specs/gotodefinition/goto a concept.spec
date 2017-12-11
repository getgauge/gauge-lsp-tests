Goto a concept
==============
* start gauge daemon for project "testdata/gotodefinition"
Go to the definition of a concept from the usage
------------------------------------------------------
* open file "/specs/invoke_concepts.spec" 

   |Heading                       |
   |------------------------------|
   |Go to definition of concepts  |
   |============================  |
   |A Concept with definition     |
   |-------------------------     |
   |* Concept2                    |
   |A Concept without a definition|
   |------------------------------|
   |* undefined Concept           |
* goto definition of "Concept2" at "4" and "4" should give details 

   |uri                       |line|range_start|range_end|
   |--------------------------|----|-----------|---------|
   |specs/concepts/concept.cpt|3   |0          |0        |