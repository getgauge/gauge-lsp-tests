Parameter code completion
=========================
* start gauge daemon for project "data/codecomplete"
Static Parameter list for codecomplete
--------------------------------------

tags: parameter

* open file "/specs/codecomplete_param.spec" 
* codecomplete in "/specs/codecomplete_param.spec" at line "5" character "7" should give "parameters" 

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
* codecomplete in "/specs/codecomplete_param.spec" at line "8" character "13" should give "parameters" 

   |label|detail |
   |-----|-------|
   |one  |dynamic|
___
* stop gauge daemon