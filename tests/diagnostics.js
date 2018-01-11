"use strict";

var assert = require('assert');

var daemon = require('./lsp/daemon');
var file = require('./util/fileExtension');
var builder = require('./lsp/util/dataBuilder');

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

step(["open <projectPath> and verify diagnostics <diagnosticsList>","get stubs for unimplemented steps project <projectPath> in language <diagnosticsList>"], async function (projectPath, diagnosticsList,done) {
  var expectedDiagnostics = await builder.buildExpectedRange(diagnosticsList, file.getFullPath(projectPath));
  daemon.registerForNotification(verifyDiagnosticsResponse,expectedDiagnostics,verifyAllDone,done)
  try{
    await daemon.startGaugeDaemon(projectPath)
  }
  catch(err){
    throw new Error('Unable to perform operation '+err)
  }
});