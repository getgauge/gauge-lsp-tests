Run from Specification
======================
* start gauge daemon for project "testdata/runFromSpecfication"
Run Spec and Scenarios must be displayed for a Specification
------------------------------------------------------------
* open file "/specs/simpleSpecification.spec" 

   |Heading              |
   |---------------------|
   |Specification Heading|
   |=====================|
   |Gauge LSP 2          |
   |---------------------|
   |* one                |
   |* start              |
   |* two                |
   |* start one          |

* ensure code lens has details 

   |title       |line|range_start|range_end|command      |arguments                |
   |------------|----|-----------|---------|-------------|-------------------------|
   |Run Scenario|2   |0          |12       |gauge.execute|%project_uri%%file_uri%:3|
   |Run Spec    |0   |0          |8        |gauge.execute|%project_uri%%file_uri%  |

Run Spec, Scenarios and run in parallel must be displayed for a Specification with test cases
---------------------------------------------------------------------------------------------
* open file "/specs/specWithTestCases.spec" 

   |Heading              |
   |---------------------|
   |Specification Heading|
   |=====================|
   |\|HEADER\|           |
   |\|------\|           |
   |\|value \|           |
   |\|value \|           |
   |Scenario             |
   |--------             |
   |* step <HEADER>      |

* ensure code lens has details 

   |title                    |line|range_start|range_end|command      |arguments                |
   |-------------------------|----|-----------|---------|-------------|-------------------------|
   |Run Scenario             |6   |0          |12       |gauge.execute|%project_uri%%file_uri%:3|
   |Run Spec\|Run in parallel|0   |0          |8        |gauge.execute|%project_uri%%file_uri%  |
