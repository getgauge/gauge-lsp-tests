Find usages
===========

* start gauge daemon for project "testdata/find-usages"

Should find usages
------------------
* ensure code lens has details for "/tests/step_implementation.js" 

   |title         |line|range_start|range_end|command             |arguments                                            |uri                          |
   |--------------|----|-----------|---------|--------------------|-----------------------------------------------------|-----------------------------|
   |2 reference(s)|13  |0          |14       |gauge.showReferences|%full_file_path%$%$Vowels in English language are {}.|/tests/step_implementation.js|
   |1 reference(s)|17  |0          |14       |gauge.showReferences|%full_file_path%$%$The word {} has {} vowels.        |/tests/step_implementation.js|
   |1 reference(s)|21  |0          |14       |gauge.showReferences|%full_file_path%$%$Almost all words have vowels {}   |/tests/step_implementation.js|
   |0 reference(s)|27  |0          |14       |gauge.showReferences|%full_file_path%$%$Zero references {}                |/tests/step_implementation.js|