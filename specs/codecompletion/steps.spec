Steps code completion
=====================
* start gauge daemon for project "testdata/codecomplete"
Steps list for codeomplete
--------------------------
* open file "/specs/codecomplete_step.spec" 
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
