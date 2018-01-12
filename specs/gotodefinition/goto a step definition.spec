Goto a step definition
======================
tags:runner-dependent

* start gauge daemon for project "data/gotodefinition-steps"
Goto definition to the implementation of a step from the specification
----------------------------------------------------------------------
* open file "/specs/concept_definition.spec"
* goto definition of "step1" in "/specs/concept_definition.spec" at "8" and "4" should give details 

   |uri                         |line|range_start|range_end|line_end|
   |----------------------------|----|-----------|---------|--------|
   |tests/step_implementation.js|6   |0          |2        |8       |

Goto definition of undefined element should give a suitable message
-------------------------------------------------------------------
tags:runner-dependent

* open file "/specs/concept_definition.spec"
* goto definition of "undefined Concept" in "/specs/concept_definition.spec" at "7" and "4" should give details 

   |error                                                     |
   |----------------------------------------------------------|
   |Step implementation not found for step : undefined Concept|
___
* stop gauge daemon
