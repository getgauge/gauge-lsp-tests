# Code Actions
* initialize project "data/code-action"

## Show code actions on undefined steps
* textDocument/didOpen for "/$specs/undefined_step.spec"
* invoke code action details "$specs/codeaction/undefinedStep.json"

## Show code actions on steps with table parameter
* textDocument/didOpen for "/$specs/withTableParameter.spec"
* invoke code action details "$specs/codeaction/withCsvParameter.json"
* invoke code action details "$specs/codeaction/withInlineParameter.json"

## Show no action on defined steps
* textDocument/didOpen for "/$specs/undefined_step.spec"
* invoke code action details "$specs/codeaction/definedStep.json"
___
* close the project
