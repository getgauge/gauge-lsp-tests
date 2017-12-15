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
var fs = require('fs');

async function verifyDiagnosticsResponse(responseMessage,expectedDiagnostics) {
  var responseUri = builder.getResponseUri(responseMessage.uri)

  if(responseMessage.diagnostics==null)
    return
    
  for (var rowIndex = 0; rowIndex < expectedDiagnostics.length; rowIndex++) {
    var expectedDiagnostic = expectedDiagnostics[rowIndex]

    if(file.getPath(responseUri)!=file.getPath(expectedDiagnostic.uri))
      continue  

    var allDiagnosticsForFile = responseMessage.diagnostics.filter(function(elem, i, array) {
      return elem.message === expectedDiagnostic.message;
    });              

    expectedDiagnostic.isValidated = true
    gauge.message("validated "+expectedDiagnostic.message)
    
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

step("open file <fileName> and verify diagnostics <diagnosticsList>", async function (fileName, diagnosticsList,done) {
  var expectedDiagnostics = await builder.buildExpectedRange(diagnosticsList);
  try{
    daemon.connection().onNotification("textDocument/publishDiagnostics", (res) => {
      try {
        verifyDiagnosticsResponse(res,expectedDiagnostics);
        verifyAllDone(done);
      } catch(e) {
        console.log(e);
      }
    });

    try{
      fileName = path.join(daemon.projectPath(), fileName);
      const content = file.parseContent(fileName)
        await notification.openFile({
            path: fileName,
            content: content
        }, daemon.connection(), daemon.projectPath());
    }
    catch(err){
        throw new Error("unable to open file "+err)
    }

  }
  catch(err){
    throw new Error("unable to verify Diagnostics response "+err)
  }
});