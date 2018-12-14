# Code Actions
* initialize project "data/code-action"

## Show code actions on undefined steps
* textDocument/didOpen for "/$specs/undefined_step.spec"
* textDocument/codeAction for "$specs/codeaction/undefinedStep.json"

## Show code actions on steps with table parameter
* textDocument/didOpen for "/$specs/withTableParameter.spec"
* textDocument/codeAction for "$specs/codeaction/withCsvParameter.json"
* textDocument/codeAction for "$specs/codeaction/withInlineParameter.json"

## Show no action on defined steps
* textDocument/didOpen for "/$specs/undefined_step.spec"
* textDocument/codeAction for "$specs/codeaction/definedStep.json"
___
* close the project
