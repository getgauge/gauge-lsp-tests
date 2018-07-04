Find usages
===========

Should find usages of a step
----------------------------
* open project "data/find-usages"
* open file with details "specs/codelens/findUsages"
* ensure reference code lens has details "specs/codelens/findUsages"

Should find usages of a step alias
----------------------------------
* open project "data/find-usages"
* open file with details "specs/codelens/findAliasUsages"
* ensure reference code lens has details "specs/codelens/findAliasUsages"

Should find usages of a concept
----------------------------------
* open project "data/find-usages"
* open file with details "specs/codelens/findConceptUsages.json"
* ensure reference code lens has details "specs/codelens/findConceptUsages.json"

## Usage of a renamed concept file should be same as before
* open project "data/find-usages"
* open file with details "specs/codelens/findConceptUsages.json"
* ensure reference code lens has details "specs/codelens/findConceptUsages.json"
* open file with details "specs/codelens/findUsages"
* ensure reference code lens has details "specs/codelens/findUsages"
* rename file "$specs/concepts.cpt" to "$specs/renamedConcepts.cpt"
* open file with details "specs/codelens/findConceptUsages_afterRename.json"
* ensure reference code lens has details "specs/codelens/findConceptUsages_afterRename.json"
* open file with details "specs/codelens/findUsages"
* ensure reference code lens has details "specs/codelens/findUsages"

___
* close the project