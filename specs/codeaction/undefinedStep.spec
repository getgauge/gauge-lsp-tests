# Code Actions
* open project "data/code-action"

## Show code actions on undefined steps
* open file "/$specs/undefined_step.spec"
* invoke code action details "specs/codeaction/undefinedStep.json"

## Show code actions on steps with table parameter
* open file "/$specs/withTableParameter.spec"
* invoke code action details "specs/codeaction/withCsvParameter.json"
* invoke code action details "specs/codeaction/withInlineParameter.json"

## Show no action on defined steps
* open file "/$specs/undefined_step.spec"
* invoke code action details "specs/codeaction/definedStep.json"
