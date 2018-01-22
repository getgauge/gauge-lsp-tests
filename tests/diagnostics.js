"use strict";

var assert = require('assert');

var languageclient = require('./lsp/languageclient');
var file = require('./util/fileExtension');
var builder = require('./lsp/util/dataBuilder');
var YAML = require('yamljs');

step("open <projectPath> and verify diagnostics with no runner <diagnosticsList>", async function (projectPath, diagnosticsList,done) {
  var expectedDiagnostics = builder.buildExpectedRange(diagnosticsList, file.getFullPath(projectPath));
  try{
    await invokeDiagnostics(projectPath,expectedDiagnostics,null,done)
  }
  catch(err){
    throw new Error('Unable to open project '+err)    
  }
});

step("get stubs for unimplemented steps project <projectPath> in language", async function (projectPath,done) {
  diagnosticsList = YAML.load("specs/generateStubs/"+process.env.language+"_impl.yaml");
  var expectedDiagnostics = builder.buildRangeFromYAML(diagnosticsList, file.getFullPath(projectPath));
  try{
    await invokeDiagnostics(projectPath,expectedDiagnostics,process.env.language,done)
  }
  catch(err){
    throw new Error('Unable to generate steps '+err)
  }
});

async function invokeDiagnostics(projectPath, expectedDiagnostics,runner,done){
  languageclient.registerForNotification(verifyDiagnosticsResponse,expectedDiagnostics,verifyAllDone,done)
  await languageclient.openProject(projectPath,runner)
}

async function verifyDiagnosticsResponse(responseMessage,expectedDiagnostics) {
  try{
    var responseUri = builder.getResponseUri(responseMessage.uri)
      
    for (var rowIndex = 0; rowIndex < expectedDiagnostics.length; rowIndex++) {
      var expectedDiagnostic = expectedDiagnostics[rowIndex]
      
      if(file.getPath(responseUri)!=file.getPath(expectedDiagnostic.uri))
        continue  
  
      var allDiagnosticsForFile = responseMessage.diagnostics.filter(function(elem, i, array) {
        return elem.message === expectedDiagnostic.message;
      });              
  
      expectedDiagnostic.isValidated = true
      expectedDiagnostic.error = []
      if(allDiagnosticsForFile.length==0)
      {
        expectedDiagnostic.error.push(expectedDiagnostic.message+" not found in "+JSON.stringify(responseMessage))
        return expectedDiagnostics
      }
      else{
        var diagnostic = allDiagnosticsForFile[0]
        // if(diagnostic.code){
        //   if(diagnostic.code!=expectedDiagnostic.code)
        //   {
        //     expectedDiagnostic.error.push(JSON.stringify(diagnostic.severity) + " not equal to " 
        //     + JSON.stringify(expectedDiagnostic.severity));  
        //   }
        // }
        if(expectedDiagnostic.severity)
        {
          if(diagnostic.severity!=expectedDiagnostic.severity)
            expectedDiagnostic.error.push(JSON.stringify(diagnostic.severity) + " not equal to " 
            + JSON.stringify(expectedDiagnostic.severity));        
        }  
      }            
    }  
  }finally{
    return expectedDiagnostics
  }
}

function verifyAllDone(expectedDiagnostics){
  if(expectedDiagnostics==null)
    return {errors:null,done:true}
  var validated = expectedDiagnostics.filter(function(elem, i, array) {
    return elem.isValidated;
  });

  if(validated.length == expectedDiagnostics.length)
  {
    var errors = expectedDiagnostics.filter(function(elem, i, array) {
      return elem.error;
    });

    return {errors:errors,done:true}
  }
  return {done:false}  
}