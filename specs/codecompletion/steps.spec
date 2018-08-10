Steps code completion
=====================

* open project "data/steps-codecomplete"

Steps list steps that are unimplemented but used
------------------------------------------------
* open file "/$specs/codecomplete_step.spec"
* codecomplete in "/$specs/codecomplete_step.spec" for subText "unimplemented s" at line "4" character "18" should give "steps" 

   |label                   |
   |------------------------|
   |unimplemented step one  |
   |unimplemented step two  |
   |unimplemented step three|

Should list steps implemented but unused steps
----------------------------------------------
* open file "/$specs/codecomplete_step.spec"
* codecomplete in "/$specs/codecomplete_step.spec" for subText "implemented step" at line "5" character "18" should give "steps" 

   |label               |
   |--------------------|
   |implemented step one|
   |implemented step two|

___
* close the project