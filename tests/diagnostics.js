"use strict";

const rpc = require('vscode-jsonrpc');
var daemon = require('./lsp/daemon');
var request = require('./lsp/request');
var table = require('./util/table');
var file = require('./util/fileExtension');
var assert = require('assert');
var builder = require('./lsp/util/dataBuilder');
var path = require('path');
var notification = require('./lsp/notification');

async function verifyDiagnosticsResponse(responseMessage) {  
  var expectedDiagnostics =gauge.dataStore.scenarioStore.get('expectedDiagnostics');

  if(expectedDiagnostics==null)
    return
  var responseUri = builder.getResponseUri(responseMessage.params.uri)
  if(responseMessage.params.diagnostics==null)
    return
  for (var rowIndex = 0; rowIndex < expectedDiagnostics.length; rowIndex++) {
    var expectedDiagnostic = expectedDiagnostics[rowIndex]

    if(file.getPath(responseUri)!=file.getPath(expectedDiagnostic.uri))
      continue  

    var allDiagnosticsForFile = responseMessage.params.diagnostics.filter(function(elem, i, array) {
      return elem.message === expectedDiagnostic.message;
    });              

    expectedDiagnostic.isValidated = true
    
    if(allDiagnosticsForFile.length==0)
      throw new Error(expectedDiagnostic.message+" not found in "+JSON.stringify(responseMessage.params))      
    
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

async function verifyAllDone(done){
  var expectedDiagnostics = gauge.dataStore.scenarioStore.get('expectedDiagnostics',expectedDiagnostics)
  if(expectedDiagnostics==null)
    done()
  var validated = expectedDiagnostics.filter(function(elem, i, array) {
    return elem.isValidated;
  });
  
  if(validated.length == expectedDiagnostics.length)
  {
    done()    
  }
}

step("diagnostics should contain diagnostics for <filePath> <diagnosticsList>", async function (filePath,diagnosticsList,done) {
    var result = await builder.buildExpectedRange(diagnosticsList);
    gauge.dataStore.scenarioStore.put('expectedDiagnostics',result)
    try{
      await daemon.handle(verifyDiagnosticsResponse, done,verifyAllDone);              
    }
    catch(err){
      throw new Error("unable to verify Diagnostics response "+err)
    }
});
