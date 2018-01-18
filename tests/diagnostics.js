"use strict";

var assert = require('assert');

var languageclient = require('./lsp/languageclient');
var file = require('./util/fileExtension');
var builder = require('./lsp/util/dataBuilder');
var YAML = require('yamljs');

step("open <projectPath> and verify diagnostics with no runner <diagnosticsList>", async function (projectPath, diagnosticsList,done) {
  var expectedDiagnostics = builder.buildExpectedRange(diagnosticsList, file.getFullPath(projectPath));
  invokeDiagnostics(projectPath,expectedDiagnostics,null,done)
});

step("get stubs for unimplemented steps project <projectPath> in language", async function (projectPath,done) {
  diagnosticsList = YAML.load("specs/generateStubs/"+process.env.language+"_impl.yaml");
  var expectedDiagnostics = builder.buildRangeFromYAML(diagnosticsList, file.getFullPath(projectPath));
  invokeDiagnostics(projectPath,expectedDiagnostics,process.env.language,done)
});

async function invokeDiagnostics(projectPath, expectedDiagnostics,runner,done){
  languageclient.registerForNotification(verifyDiagnosticsResponse,expectedDiagnostics,verifyAllDone,done)
  try{
    await languageclient.openProject(projectPath,runner)
  }
  catch(err){
    throw new Error('Unable to perform operation '+err)
  }
}

async function verifyDiagnosticsResponse(responseMessage,expectedDiagnostics) {
  var responseUri = builder.getResponseUri(responseMessage.uri)
      
  for (var rowIndex = 0; rowIndex < expectedDiagnostics.length; rowIndex++) {
    var expectedDiagnostic = expectedDiagnostics[rowIndex]
   
    if(file.getPath(responseUri)!=file.getPath(expectedDiagnostic.uri))
      continue  

    gauge.message("verified "+responseUri)
    var allDiagnosticsForFile = responseMessage.diagnostics.filter(function(elem, i, array) {
      return elem.message === expectedDiagnostic.message;
    });              

    expectedDiagnostic.isValidated = true
    
    if(allDiagnosticsForFile.length==0)
      throw new Error(expectedDiagnostic.message+" not found in "+JSON.stringify(responseMessage))      
    
    var diagnostic = allDiagnosticsForFile[0]
    if(expectedDiagnostic.severity)
    {
      assert.equal(diagnostic.severity, expectedDiagnostic.severity, 
        JSON.stringify(diagnostic.severity) + " not equal to " 
        + JSON.stringify(expectedDiagnostic.severity));        
    }
  }

  gauge.dataStore.scenarioStore.put('expectedDiagnostics',expectedDiagnostics)  
}

function verifyAllDone(){
  var expectedDiagnostics = gauge.dataStore.scenarioStore.get('expectedDiagnostics',expectedDiagnostics)
  if(expectedDiagnostics==null)
    return true    
  var validated = expectedDiagnostics.filter(function(elem, i, array) {
    return elem.isValidated;
  });

  if(validated.length == expectedDiagnostics.length)
    return true  
}