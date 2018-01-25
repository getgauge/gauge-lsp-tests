Steps code completion
=====================

* open project "data/steps-codecomplete"
Steps list for codecomplete
--------------------------
* open file "/specs/codecomplete_step.spec"
* codecomplete in "/specs/codecomplete_step.spec" at line "4" character "7" should give "steps" 

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

Should list steps implemented but not used
------------------------------------------
* open file "/specs/codecomplete_step.spec"
* codecomplete in "/specs/codecomplete_step.spec" at line "4" character "7" should give "steps" 

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
___
* stop gauge daemon
