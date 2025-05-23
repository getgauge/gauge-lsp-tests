Format
============
* initialize project "data/format"

Should format a Specification
-----------------------------
tags: actions_on_project_load
* open file "/$specs/toBeFormatted.spec" with content "/$specs/beforeFormat.spec"
* format file "/$specs/toBeFormatted.spec" and ensure formatted contents are <file:data/format/specifications/afterFormat.spec>

Should format a Concept
-----------------------------
tags: actions_on_project_load
* open file "/$specs/toBeFormatted.cpt" with content "/$specs/beforeFormat.cpt"
* format file "/$specs/toBeFormatted.cpt" and ensure formatted contents are <file:data/format/specifications/afterFormat.cpt>

___
* close the project