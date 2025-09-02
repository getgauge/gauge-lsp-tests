Steps code completion
=====================

* initialize project "data/steps-codecomplete"

Steps list steps that are unimplemented but used
------------------------------------------------
tags: actions_on_project_load
* textDocument/didOpen for "/$specs/codecomplete_step.spec"
* textDocument/completion in "/$specs/codecomplete_step.spec" for subText "unimplemented s" at line "4" character "18" should give "steps" 

   |label                   |
   |------------------------|
   |unimplemented step one  |
   |unimplemented step two  |
   |unimplemented step three|

Should list steps implemented but unused steps
----------------------------------------------
tags: actions_on_project_load
* textDocument/didOpen for "/$specs/codecomplete_step.spec"
* textDocument/completion in "/$specs/codecomplete_step.spec" for subText "implemented step" at line "5" character "18" should give "steps" 

   |label               |
   |--------------------|
   |implemented step one|
   |implemented step two|

A newly added step appears in the list after file save
-----------------------------------------------------------
tags: actions_on_file_edit
* textDocument/didOpen for "/$specs/codecomplete_step.spec"
* edit content of file from "/$specs/codecomplete_step.spec" to "/$specs/new_step_codecomplete_step.txt" and save 
* wait for "2" seconds
* textDocument/completion in "/$specs/codecomplete_step.spec" for subText "new" at line "7" character "5" should give "steps" 

   |label    |
   |---------|
   |new unimplemented step|
___
* close the project