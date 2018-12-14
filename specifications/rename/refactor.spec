# Refactor
* initialize project "data/refactor"
* wait for "0.1" seconds

## Refactor step in a specification
tags: actions_on_project_load
* open file with details "$specs/rename/step"
* textDocument/rename with details "$specs/rename/step"

## Refactor step in a concept
tags: actions_on_project_load
* open file with details "$specs/rename/step_in_concept"
* textDocument/rename with details "$specs/rename/step_in_concept"

## Refactor concept used in a specification
tags: actions_on_project_load
* open file with details "$specs/rename/concept/concept_impl.json"
* textDocument/rename with details "$specs/rename/concept/concept_impl.json"

## Refactor with csv parameter
tags: actions_on_project_load
* open file with details "$specs/rename/withCsvParameter"
* textDocument/rename with details "$specs/rename/withCsvParameter"

## Refactor to add a parameter before existing param
tags: actions_on_project_load
* open file with details "$specs/rename/beforeExistingParam"
* textDocument/rename with details "$specs/rename/beforeExistingParam"

___
* close the project