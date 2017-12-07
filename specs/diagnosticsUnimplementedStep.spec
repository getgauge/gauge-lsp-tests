Stub for unimplemented Steps
============================
* start gauge daemon for project "testdata/gotodefinition"
Generate Code for Simple Unimplemented step
-------------------------------------------
* diagnostics should contain diagnostics for "/specs/concept_definition.spec" 

   |line|range_start|range_end|severity|message                      |code                                                                              |
   |----|-----------|---------|--------|-----------------------------|----------------------------------------------------------------------------------|
   |2   |0          |10000    |1       |Step implementation not found|step(\"undefined Concept\", async function() {\n\tthrow 'Unimplemented Step';\n});|

* open file "/specs/concept_definition.spec" and handle diagnostics for content 

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

