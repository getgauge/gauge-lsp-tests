Duplicate diagnostics
=====================
Get all parse errors
-----------------------------
* open "data/parse-errors-duplicate" and verify diagnostics

   |line|range_start|range_end|severity|message                                         |uri                                               |
   |----|-----------|---------|--------|------------------------------------------------|--------------------------------------------------|
   |3   |0          |10000    |1       |Duplicate concept definition found              |/specs/concepts/duplicateConcepts.cpt             |
___
* stop gauge daemon