Duplicate diagnostics
=====================
tags: no-lang-runner
Get all parse errors
-----------------------------
* open "data/parse-errors/duplicate-concepts" and verify diagnostics with no runner

   |line|range_start|range_end|severity|message                                         |uri                                               |
   |----|-----------|---------|--------|------------------------------------------------|--------------------------------------------------|
   |3   |0          |10000    |1       |Duplicate concept definition found              |/specs/concepts/duplicateConcepts.cpt             |
___
* stop gauge daemon