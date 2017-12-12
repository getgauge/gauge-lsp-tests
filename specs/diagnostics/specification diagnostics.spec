Diagnostics on spec file
========================
* start gauge daemon for project "testdata/parse-errors"
Multiple Spec Headings
----------------------
* diagnostics should contain diagnostics for "/specs/multipleSpecHeadings.spec" 

   |line|range_start|range_end|severity|message                                  |
   |----|-----------|---------|--------|-----------------------------------------|
   |1   |0          |10000    |1       |Multiple spec headings found in same file|

Spec without elements
---------------------
* diagnostics should contain diagnostics for "/specs/specWithoutElements.spec" 

   |line|range_start|range_end|severity|message                        |
   |----|-----------|---------|--------|-------------------------------|
   |0   |0          |10000    |1       |Spec does not have any elements|
Tear down three underscore
--------------------------
* diagnostics should contain diagnostics for "/specs/tearDownThreeUnderscore.spec" 

   |line|range_start|range_end|severity|message                                                  |
   |----|-----------|---------|--------|---------------------------------------------------------|
   |5   |0          |10000    |1       |Teardown should have at least three underscore characters|

Without scenario heading
------------------------
* diagnostics should contain diagnostics for "/specs/withoutScenarioHeading.spec" 

   |line|range_start|range_end|severity|message                                            |
   |----|-----------|---------|--------|---------------------------------------------------|
   |2   |0          |10000    |1       |Scenario heading should have at least one character|
   |1   |0          |10000    |1       |Scenario should have atleast one step              |

Without spec heading
--------------------
* diagnostics should contain diagnostics for "/specs/withoutSpecHeading.spec" 

   |line|range_start|range_end|severity|message                        |
   |----|-----------|---------|--------|-------------------------------|
   |0   |0          |10000    |1       |Spec does not have any elements|