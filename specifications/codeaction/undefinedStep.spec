# Code Actions
* initialize project "data/code-action"

## Show code actions on undefined steps
tags: actions_on_project_load
* textDocument/didOpen for "/$specs/undefined_step.spec"
* textDocument/codeAction for "$specs/codeaction/undefinedStep.json"

## Show code actions on steps with table parameter
tags: actions_on_project_load
* textDocument/didOpen for "/$specs/withTableParameter.spec"
* textDocument/codeAction for "$specs/codeaction/withCsvParameter.json"
* textDocument/codeAction for "$specs/codeaction/withInlineParameter.json"

## Show no action on defined steps
tags: actions_on_project_load
* textDocument/didOpen for "/$specs/undefined_step.spec"
* textDocument/codeAction for "$specs/codeaction/definedStep.json"

## Show no action on when new concept definition is added
tags: actions_on_project_edit
* textDocument/didOpen for "/$specs/undefined_step.spec"
* textDocument/codeAction for "$specs/codeaction/undefinedStep.json"
* generate concept "another scenario" in new file under "$specs" and verify
* textDocument/codeAction for "$specs/codeaction/newDefinition.json"

## Show no action on when new step definition is added
tags: actions_on_project_edit, knownIssue
* textDocument/didOpen for "/$specs/undefined_step.spec"
* textDocument/codeAction for "$specs/codeaction/undefinedStep.json"
* generate new step definition "somecode" in new file
___
* close the project
