Goto definition
===============
* start gauge daemon for project "testdata\\gotodefinition"
Goto definition of concepts
---------------------------
* open file "\\specs\\invoke_concepts.spec" 

   |Heading                       |
   |------------------------------|
   |Go to definition of concepts  |
   |============================  |
   |A Concept with definition     |
   |-------------------------     |
   |* Concept1                    |
   |A Concept without a definition|
   |------------------------------|
   |* undefined Concept           |
* goto definition of "Concept1" at "4" and "4" should give details 

   |uri                       |line|range_start|range_end|
   |--------------------------|----|-----------|---------|
   |specs/concepts/concept.cpt|3   |0          |0        |

Goto definition of undefined concepts
---------------------------
* open file "\\specs\\invoke_concepts.spec" 

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
* goto definition of concept "undefined Concept" should give error "Step implementation not found"