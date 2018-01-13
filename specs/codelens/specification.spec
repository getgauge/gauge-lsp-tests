Display Run links
==================
tags: no-lang-runner

* start gauge daemon for project "data/runFromSpecfication"
Run links must be dispalyed at Spec and Scenarios levels
---------------------------------------------------------
* open file "/specs/simpleSpecification.spec"
* ensure code lens has details for "/specs/simpleSpecification.spec"

   |title       |line|range_start|range_end|command      |arguments                  |uri                            |
   |------------|----|-----------|---------|-------------|---------------------------|-------------------------------|
   |Run Scenario|2   |0          |12       |gauge.execute|%project_path%%file_path%:3|/specs/simpleSpecification.spec|
   |Run Spec    |0   |0          |8        |gauge.execute|%project_path%%file_path%  |/specs/simpleSpecification.spec|

Run links must be dispalyed for Specification with test cases in a Specification
---------------------------------------------------------------------------------
* open file "/specs/specWithTestCases.spec"
* ensure code lens has details for "/specs/specWithTestCases.spec"

   |title                    |line           |range_start|range_end|command      |arguments                  |uri                          |
   |-------------------------|---------------|-----------|---------|-------------|---------------------------|-----------------------------|
   |Run Scenario             |3              |0          |12       |gauge.execute|%project_path%%file_path%:3|/specs/specWithTestCases.spec|
   |Run Spec\|Run in parallel|0              |0          |8        |gauge.execute|%project_path%%file_path%  |/specs/specWithTestCases.spec|
___
* stop gauge daemon
