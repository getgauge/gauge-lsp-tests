Tag completion
===============
* start gauge daemon for project "testdata/codecomplete"
Tag list for codecomplete
-------------------------
* open file "/specs/someTags/tocodecomplete.spec" 

   |Content              |
   |---------------------|
   |Specification Heading|
   |=====================|
   |Gauge LSP 2          |
   |-----------          |
   |tags:                |
   |* one "something"    |

* codecomplete at line "4" character "7" should give "tags" 

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
