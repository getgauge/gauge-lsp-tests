Steps code completion
=====================
* start gauge daemon for project "testdata/codecomplete"
Steps list for codeomplete
--------------------------
* open file "/specs/codecomplete_step.spec" 

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
* codecomplete at line "4" character "7" should give "steps" 

   |label                    |
   |-------------------------|
   |one                      |
   |two                      |
   |one <something>          |
   |start <s>                |
   |start one <one>          |
   |start one                |
   |two <another> <parameter>|
   |start                    |
