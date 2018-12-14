Goto a concept
==============
tags: no-lang-runner
* initialize project "data/gotodefinition"

Go to the definition of a concept from the usage
------------------------------------------------
tags: actions_on_project_load
* textDocument/didOpen for "/$specs/concept_definition.spec"
* goto definition of step "Concept2" in "/$specs/concept_definition.spec" at "4" and "4" should give details "$specs/gotodefinition/concept.json"

___
* close the project