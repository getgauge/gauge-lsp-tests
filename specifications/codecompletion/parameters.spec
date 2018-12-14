Parameter code completion
=========================

tags: no-lang-runner

* initialize project "data/codecomplete"

Static Parameter list for codecomplete
--------------------------------------
tags: actions_on_project_load
* textDocument/didOpen for "/$specs/codecomplete_param.spec"
* textDocument/completion in "/$specs/codecomplete_param.spec" for subText "" at line "5" character "15" should give "parameters" 

   |label    |detail|
   |---------|------|
   |something|static|
   |s        |static|
   |another  |static|
   |parameter|static|

Dynamic Parameter list for codecomplete
---------------------------------------
tags: actions_on_project_load
* textDocument/didOpen for "/$specs/codecomplete_param.spec"
* textDocument/completion in "/$specs/codecomplete_param.spec" for subText "" at line "8" character "15" should give "parameters" 

   |label|detail |
   |-----|-------|
   |one  |dynamic|

A newly added parameter appears in the list after file save
-----------------------------------------------------------
tags: actions_on_file_edit
* textDocument/didOpen for "/$specs/edit_codecomplete_param.spec"
* edit content "/$specs/edit_codecomplete_param.spec" to "/$specs/more_codecomplete_param.txt" and save 
* wait for "1" seconds
* textDocument/completion in "/$specs/edit_codecomplete_param.spec" for subText "" at line "5" character "15" should give "parameters" 

   |label    |detail|
   |---------|------|
   |something|static|
   |s        |static|
   |more     |static|
   |another  |static|
   |parameter|static|

___
* close the project
