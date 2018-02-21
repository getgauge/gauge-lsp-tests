Parameter code completion
=========================

tags: no-lang-runner

* open project "data/codecomplete"
Static Parameter list for codecomplete
--------------------------------------

* open file "/specs/codecomplete_param.spec"
* codecomplete in "/specs/codecomplete_param.spec" for subText "" at line "5" character "15" should give "parameters" 

   |label    |detail|
   |---------|------|
   |something|static|
   |s        |static|
   |another  |static|
   |parameter|static|

Dynamic Parameter list for codecomplete
---------------------------------------

* open file "/specs/codecomplete_param.spec"
* codecomplete in "/specs/codecomplete_param.spec" for subText "" at line "8" character "15" should give "parameters" 

   |label|detail |
   |-----|-------|
   |one  |dynamic|

A newly added parameter appears in the list after file save
-----------------------------------------------------------
* open file "/specs/edit_codecomplete_param.spec"
* edit file content "/specs/edit_codecomplete_param.spec" to "/specs/more_codecomplete_param.txt" and save
* codecomplete in "/specs/edit_codecomplete_param.spec" for subText "" at line "5" character "15" should give "parameters" 

   |label    |detail|
   |---------|------|
   |something|static|
   |s        |static|
   |more     |static|
   |another  |static|
   |parameter|static|
