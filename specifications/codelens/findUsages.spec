Find usages
===========

Should find usages of a step
----------------------------
tags: actions_on_project_load
* initialize project "data/find-usages"
* open file with details "$specs/codelens/findUsages"
* ensure reference code lens has details "$specs/codelens/findUsages"

Should find usages of a step alias
----------------------------------
tags: actions_on_project_load
* initialize project "data/find-usages"
* open file with details "$specs/codelens/findAliasUsages"
* ensure reference code lens has details "$specs/codelens/findAliasUsages"

Should find usages of a concept
----------------------------------
tags: actions_on_project_load
* initialize project "data/find-usages"
* open file with details "$specs/codelens/findConceptUsages.json"
* ensure reference code lens has details "$specs/codelens/findConceptUsages.json"

Usage of a renamed concept file should be same as before
--------------------------------------------------------
tags: actions_on_project_load
* initialize project "data/find-usages"
* open file with details "$specs/codelens/findConceptUsages.json"
* ensure reference code lens has details "$specs/codelens/findConceptUsages.json"
* open file with details "$specs/codelens/findUsages"
* ensure reference code lens has details "$specs/codelens/findUsages"
* rename file "$specs/concepts.cpt" to "$specs/renamedConcepts.cpt"
* open file with details "$specs/codelens/findConceptUsages_afterRename.json"
* ensure reference code lens has details "$specs/codelens/findConceptUsages_afterRename.json"
* open file with details "$specs/codelens/findUsages"
* ensure reference code lens has details "$specs/codelens/findUsages"

Usage of a step removed by edit should be reflected
---------------------------------------------------
tags: actions_on_file_edit
* initialize project "data/find-usages"
* open file with details "$specs/codelens/findUsages"
* ensure reference code lens has details "$specs/codelens/findUsages"
* textDocument/didOpen for "/$specs/two.spec"
* edit content of file from "/$specs/two.spec" to "/$specs/edit_removeStepfromFile_two.txt" and save 
* open file with details "$specs/codelens/findUsagesAfterStepDeleted"
* ensure reference code lens has details "$specs/codelens/findUsagesAfterStepDeleted"

Usage of a concept removed by edit should be reflected
------------------------------------------------------
tags: actions_on_project_load
* initialize project "data/find-usages"
* open file with details "$specs/codelens/findUsages"
* ensure reference code lens has details "$specs/codelens/findUsages"
* textDocument/didOpen for "/$specs/one.spec"
* edit content of file from "/$specs/one.spec" to "/$specs/edit_removeConceptFromFile_one.txt" and save 
* open file with details "$specs/codelens/findConceptUsages_afterEdit.json"
* ensure reference code lens has details "$specs/codelens/findConceptUsages_afterEdit.json"
___
* close the project