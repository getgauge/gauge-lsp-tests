# Stub for unimplemented Steps

## Generate Code for Simple Unimplemented step
* copy cached template + required data (specs,env,impl "data/generatestubs") into the temporary directory
* execute gauge language runner pre-requisite
* get stubs for unimplemented steps for project with details "$specs/generateStubs"
* ensure diagnostics verified

## Get Implementation Files
* initialize project "data/generatestubs"
* get implementation files

## Should generate new Concept files
* initialize project "data/generatestubs"
* generate concept "name" in new file under "$specs" and verify

## Should generate existing Concept files
* initialize project "data/generatestubs"
* generate concept "name" in file "conceptExample.cpt" of "$specs" and verify

___
* close the project