# Goto a step definition

* open project "data/steps-gotodefinition" in temporary Directory
## Goto definition to the implementation of a step from the specification
* open file "/specs/implementedStep.spec" in temporaryDirectory
* goto definition of step "step1" in project "data/steps-gotodefinition" "/specs/implementedStep.spec" at "8" and "8" should give details "specs/gotodefinition/implementedStep"

## Goto definition of undefined element should give a suitable message
* open file "/specs/concept_definition.spec" in temporaryDirectory
* goto definition of "undefined Concept" in "/specs/concept_definition.spec" at "7" and "4" should give error for 

   |error                                                     |
   |----------------------------------------------------------|
   |Step implementation not found for step : undefined Concept|
