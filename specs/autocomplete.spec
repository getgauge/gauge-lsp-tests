Autocomplete
============
* start gauge daemon for project "testdata/autocomplete"
Steps list for autcomplete
--------------------------
* open file "/specs/autocomplete_step.spec" 

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
* autocomplete at line "4" character "7" should give "steps" 

   |label                    |
   |-------------------------|
   |one                      |
   |start                    |
   |two                      |
   |start one                |
   |one <something>          |
   |start <s>                |
   |two <another> <parameter>|
   |start one <one>          |

Parameter list for autocomplete
-------------------------------
* open file "/specs/autocomplete_param.spec" 

   |Heading                             |
   |------------------------------------|
   |Specification Heading               |
   |=====================               |
   |table:/testdata/autocomplete/csv.csv|
   |Gauge LSP 2                         |
   |---------------------               |
   |* one "something"                   |
   |* start "s"                         |
   |* two "another" "parameter"         |
   |* start one <one>                   |
* autocomplete at line "5" character "7" should give "parameters" 

   |label    |detail|
   |---------|------|
   |something|6     |
   |s        |6     |
   |another  |6     |
   |parameter|6     |
   |one      |7     |

Tag list for autocomplete
-------------------------
* open file "/specs/autocomplete_param.spec" 

   |Heading                             |
   |------------------------------------|
   |Specification Heading               |
   |=====================               |
   |table:/testdata/autocomplete/csv.csv|
   |Gauge LSP 2                         |
   |---------------------               |
   |* one "something"                   |
   |* start "s"                         |
   |* two "another" "parameter"         |
   |* start one <one>                   |
* todo autocomplete for tags
