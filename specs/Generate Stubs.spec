Stub for unimplemented Steps
============================
* start gauge daemon for project "testdata/gotodefinition"
Generate Code for Simple Unimplemented step
-------------------------------------------
* diagnostics should contain diagnostics for "/specs/concepts/concept.cpt" 

   |line|range_start|range_end|severity|message                      |code                                                                              |
   |----|-----------|---------|--------|-----------------------------|----------------------------------------------------------------------------------|
   |4   |0          |10000    |1       |Step implementation not found|step(\"one\", async function() {\n\tthrow 'Unimplemented Step';\n});|

* open file "/specs/concepts/concept.cpt" and handle diagnostics for content 

   |Heading                       |
   |------------------------------|
   |Go to definition of concepts  |
   |============================  |
   |A Concept with definition     |
   |-------------------------     |
   |* Concept2                    |
   |                              |
   |A Concept without a definition|
   |-------------------------     |
   |* undefined Concept           |
   |* step1                       |

