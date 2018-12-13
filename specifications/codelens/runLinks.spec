Display Run links
==================
tags: no-lang-runner

* initialize project "data/displaylink-torun"

Display links to run Spec and Scenario in a Specification
---------------------------------------------------------
* textDocument/didOpen for "/$specs/simpleSpecification.spec"
* ensure spec code lens has details "$specs/codelens/runLinks/simpleSpec.json"

Display links to run Specification with test cases in a Specification
-----------------------------------------------------------------------
* textDocument/didOpen for "/$specs/specWithTestCases.spec"
* ensure spec code lens has details "$specs/codelens/runLinks/withTestCases.json"

___
* close the project