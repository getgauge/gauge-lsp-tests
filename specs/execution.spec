Execution
=========
* start gauge daemon for project "testdata/execution"
Execute Scenario
----------------
* open file "/specs/execution_scenario.spec" 

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
