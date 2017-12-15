Duplicate diagnostics
=====================
* start gauge daemon for project "testdata/parse-errors-duplicate"
Get all parse errors
-----------------------------
* open file "/specs/concepts/duplicateConcepts.cpt" and verify diagnostics

   |line|range_start|range_end|severity|message                                         |uri                                               |
   |----|-----------|---------|--------|------------------------------------------------|--------------------------------------------------|
   |3   |0          |10000    |1       |Duplicate concept definition found              |/specs/concepts/duplicateConcepts.cpt             |
___
* stop gauge daemon