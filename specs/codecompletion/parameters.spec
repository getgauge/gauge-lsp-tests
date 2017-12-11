Parameter code completion
=========================
* start gauge daemon for project "testdata/codecomplete"
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
