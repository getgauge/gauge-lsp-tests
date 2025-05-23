Format
============
* initialize project "data/format"

Should format a Specification
-----------------------------
tags: actions_on_project_load
* open file "/$specs/toBeFormatted.spec" with content "/$specs/beforeFormat.spec"
* format file "/$specs/toBeFormatted.spec" and ensure formatted contents are <file:data/format/specifications/afterFormat.spec>

Should format a Specification edited without saving
---------------------------------------------------
tags: actions_on_project_load
* open file "/$specs/empty.spec" with content "/$specs/empty.spec"
* edit content of file from "/$specs/empty.spec" to "/$specs/beforeFormat.spec" without saving
* format file "/$specs/empty.spec" and ensure formatted contents are <file:data/format/specifications/afterFormat.spec>


Should format a Concept
-----------------------------
tags: actions_on_project_load
* open file "/$specs/toBeFormatted.cpt" with content "/$specs/beforeFormat.cpt"
* format file "/$specs/toBeFormatted.cpt" and ensure formatted contents are <file:data/format/specifications/afterFormat.cpt>

Should format a Concept edited without saving
---------------------------------------------
tags: actions_on_project_load
* open file "/$specs/empty.cpt" with content "/$specs/empty.cpt"
* edit content of file from "/$specs/empty.cpt" to "/$specs/beforeFormat.cpt" without saving
* format file "/$specs/empty.cpt" and ensure formatted contents are <file:data/format/specifications/afterFormat.cpt>


___
* close the project