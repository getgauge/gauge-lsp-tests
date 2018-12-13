Tag completion
==============

tags: no-lang-runner

* initialize project "data/codecomplete"

Tag list for codecomplete
-------------------------
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

___
* close the project