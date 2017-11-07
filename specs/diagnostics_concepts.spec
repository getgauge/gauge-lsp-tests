Diagnostics on concept file
===========================
* start gauge daemon for project "testdata\\parse-errors"
Concepts should have atleast one step
-------------------------------------
* diagnostics should contain error 

   |line|range_start|range_end|severity|message                             |
   |----|-----------|---------|--------|------------------------------------|
   |0   |0          |9        |1       |Concept should have atleast one step|

* open file "\\specs\\concepts\\conceptShouldHaveOneStep.cpt" and handle diagnostics for content 

   |Heading  |
   |---------|
   |# Concept|

Step not in a concept
---------------------
* diagnostics should contain error 

   |line|range_start|range_end|severity|message                                     |
   |----|-----------|---------|--------|--------------------------------------------|
   |0   |0          |7        |1       |Step is not defined inside a concept heading|

* open file "\\specs\\concepts\\stepNotInConcept.cpt" and handle diagnostics for content 

   |Heading          |
   |-----------------|
   |* step1          |
   |# Concept Heading|
   |* step1          |
   |* step2          |

Scenario heading not allowed in concept
---------------------------------------
* diagnostics should contain error 

   |line|range_start|range_end|severity|message                                        |
   |----|-----------|---------|--------|-----------------------------------------------|
   |0   |0          |18       |1       |Scenario Heading is not allowed in concept file|

* open file "\\specs\\concepts\\stepNotInConcept.cpt" and handle diagnostics for content 

   |Heading           |
   |------------------|
   |##Scenario heading|

Concept Heading can have only dynamic parameters
------------------------------------------------
* diagnostics should contain error 

   |line|range_start|range_end|severity|message                                         |
   |----|-----------|---------|--------|------------------------------------------------|
   |0   |0          |18       |1       |Concept heading can have only Dynamic Parameters|

* open file "\\specs\\concepts\\headingToHaveOnlyDynamicParams.cpt" and handle diagnostics for content 

   |Heading           |
   |------------------|
   |# Concept "static"|

Table does'nt belong to any step
--------------------------------
* diagnostics should contain error 

   |line|range_start|range_end|severity|message                         |
   |----|-----------|---------|--------|--------------------------------|
   |1   |0          |7        |1       |Table doesn't belong to any step|

* open file "\\specs\\concepts\\tableDoesNotBelongToAnyStep.cpt" and handle diagnostics for content 

   |Heading  |
   |---------|
   |# Concept|
   |\|table\||
   |\|one\|  |
   |* step1  |
