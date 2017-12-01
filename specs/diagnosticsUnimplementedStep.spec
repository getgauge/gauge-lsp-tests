Unimplemented Step diagnostics
==============================
Code for Simple Unimplemented step
----------------------------------
* diagnostics should contain 

   |line|range_start|range_end|severity|message                                  |
   |----|-----------|---------|--------|-----------------------------------------|
   |2   |0          |10000    |1       |Multiple spec headings found in same file|

* open file "/specs/multipleSpecHeadings.spec" and handle diagnostics for content 

   |Heading             |
   |--------------------|
   |Spec                |
   |================    |
   |Scenario Heading    |
   |----------------    |
   |* unimplemented step|

