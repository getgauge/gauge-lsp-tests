Tag completion
==============

* initialize project "data/codecomplete"

Tag list for codecomplete
-------------------------
tags: actions_on_project_load
* textDocument/didOpen for "/$specs/someTags/tagCompletion.spec"
* textDocument/completion in "/$specs/someTags/tagCompletion.spec" for subText "" at line "4" character "15" should give "tags" 

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

A newly added tag appears in the list after file save
-----------------------------------------------------------
tags: actions_on_file_edit
* textDocument/didOpen for "/$specs/someTags/tagAtScenarioLevel.spec"
* edit content of file from "/$specs/someTags/tagAtScenarioLevel.spec" to "/$specs/someTags/more_tagAtScenarioLevel.txt" and save 
* wait for "1" seconds
* textDocument/didOpen for "/$specs/someTags/tagAtSpecLevel.spec"
* edit content of file from "/$specs/someTags/tagAtSpecLevel.spec" to "/$specs/someTags/more_tagAtSpecLevel.txt" and save 
* wait for "2" seconds
* textDocument/didOpen for "/$specs/someTags/tagCompletion.spec"
* textDocument/completion in "/$specs/someTags/tagCompletion.spec" for subText "" at line "4" character "15" should give "tags" 

   |label         |
   |--------------|
   |next line1    |
   |next line2    |
   |ScenarioLevel1|
   |ScenarioLevel2|
   |ScenarioLevel3|
   |specLevel     |
   |specLevel1    |
   |SpecLevel1    |
   |SpecLevel2    |
   |with space    |

___
* close the project