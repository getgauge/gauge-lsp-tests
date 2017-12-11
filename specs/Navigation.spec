Navigation
==========
* start gauge daemon for project "testdata/gotodefinition"
Navigate to the definition of a concept
---------------------------------------
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

Navigation of undefined element should give a suitable message
--------------------------------------------------------------
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
* goto definition of "undefined Concept" at "7" and "4" should give details 

   |message                                                   |
   |----------------------------------------------------------|
   |Step implementation not found for step : undefined Concept|

Navigation to the implementation of a step from the concept
------------------------------------------------------------
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
   |* step1                       |
* goto definition of "step1" at "8" and "4" should give details 

   |uri                         |line|range_start|range_end|
   |----------------------------|----|-----------|---------|
   |tests/step_implementation.js|7   |0          |0        |
