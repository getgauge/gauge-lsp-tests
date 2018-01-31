Display Run links
==================
tags: no-lang-runner

* open project "data/displaylink-torun"
Display links to run Spec and Scenario in a Specification
---------------------------------------------------------
* open file "/specs/simpleSpecification.spec"
* ensure code lens has details "specs/codelens/runLinks/simpleSpec.yaml"

Display links to run Specification with test cases in a Specification
-----------------------------------------------------------------------
* open file "/specs/specWithTestCases.spec"
* ensure code lens has details "specs/codelens/runLinks/withTestCases.yaml"
___
* stop gauge daemon
