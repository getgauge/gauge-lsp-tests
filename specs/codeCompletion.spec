Code completion
===============
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

Static Parameter list for codecomplete
--------------------------------------
tags: parameter
* open file "/specs/codecomplete_param.spec" 

   |Heading                             |
   |------------------------------------|
   |Specification Heading               |
   |=====================               |
   |table:/testdata/codecomplete/csv.csv|
   |Gauge LSP 2                         |
   |---------------------               |
   |* one "something"                   |
   |* start "s"                         |
   |* two "another" "parameter"         |
   |* start one <one>                   |
* codecomplete at line "5" character "7" should give "parameters" 

   |label    |detail|
   |---------|------|
   |something|static|
   |s        |static|
   |another  |static|
   |parameter|static|

Dynamic Parameter list for codecomplete
---------------------------------------
tags: parameter
* open file "/specs/codecomplete_param.spec" 

   |Heading                             |
   |------------------------------------|
   |Specification Heading               |
   |=====================               |
   |table:\\testdata\\codecomplete\\csv.csv|
   |Gauge LSP 2                         |
   |---------------------               |
   |* one "something"                   |
   |* start "s"                         |
   |* two "another" "parameter"         |
   |* start one <one>                   |
* codecomplete at line "8" character "13" should give "parameters" 

   |label|detail |
   |-----|-------|
   |one  |dynamic|

Tag list for codecomplete
-------------------------
* open file "/specs/someTags/tocodecomplete.spec" 

   |Heading              |
   |---------------------|
   |Specification Heading|
   |=====================|
   |Gauge LSP 2          |
   |-----------          |
   |tags:                |
   |* one "something"    |

* codecomplete at line "4" character "7" should give "tags" 

   |label         |
   |--------------|
   |next line1    |
   |next line2    |
   |ScenarioLevel1|
   |ScenarioLevel2|
   |specLevel     |
   |SpecLevel1    |
   |SpecLevel2    |
   |with space    |
