Stub for unimplemented Steps
============================
* start gauge daemon for project "testdata/generatestubs"
Generate Code for Simple Unimplemented step
-------------------------------------------
* diagnostics should contain diagnostics for "/specs/concept_definition.spec" 

   |line|range_start|range_end|severity|message                      |code                                                                         |uri                           |
   |----|-----------|---------|--------|-----------------------------|-----------------------------------------------------------------------------|------------------------------|
   |4   |0          |10000    |1       |Step implementation not found|step("undefined step", async function() {\n\tthrow 'Unimplemented Step';\n});|/specs/concept_definition.spec|

___
* stop gauge daemon