Format
============
* initialize project "data/format"

Should format a Specification
-----------------------------
tags: actions_on_project_load
* open file "/$specs/toBeFormatted.spec" with content "/$specs/beforeFormat.spec"
* format file "/$specs/toBeFormatted.spec" and ensure formatted contents are <file:data/format/specifications/afterFormat.spec>

___
* close the project