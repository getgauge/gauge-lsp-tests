"use strict";

var assert = require('assert');
var path = require('path');
var languageclient = require('./lsp/languageclient');
var file = require('./util/fileExtension');
var builder = require('./lsp/util/dataBuilder');

function addProjectPath(expectedDiagnostics,projectPath){
  for (var rowIndex = 0; rowIndex < expectedDiagnostics.length; rowIndex++) {
    var expectedDiagnostic = expectedDiagnostics[rowIndex];
    expectedDiagnostic.uri =  builder.updateSpecsDir(path.join(projectPath,expectedDiagnostic.uri));
    expectedDiagnostic.message = expectedDiagnostic.message.replace('%project_path%%file_path%',expectedDiagnostic.uri);
  }
}

step("open project and verify diagnostics <diagnosticsList>", async function (diagnosticsList,done) {
  var expectedDiagnostics = builder.buildDiagnostics(diagnosticsList);
  addProjectPath(expectedDiagnostics,languageclient.projectPath())
  try{
    await invokeDiagnostics(expectedDiagnostics,process.env.language,done)
  }
  catch(err){
    console.log(err.stack)
    gauge.message(err.stack)
    throw new Error('Unable to open project '+err)    
  }
});

step("ensure diagnostics verified", async function() {
  var errors =languageclient.verificationFailures() 
  assert.ok(errors==null || errors.length==0,errors)
});
step("get stubs for unimplemented steps for project with details <details>", async function (details, done) {
  var expectedDiagnostics = builder.loadJSON(details);
  addProjectPath(expectedDiagnostics,languageclient.projectPath())

  try{
    await invokeDiagnostics(expectedDiagnostics,process.env.language,done)
  }
  catch(err){
    console.log(err.stack)
    gauge.message(err.stack)

    throw new Error('Unable to generate steps '+err)
  }
});

async function invokeDiagnostics(expectedDiagnostics,runner,done){
  languageclient.registerForNotification(verifyDiagnosticsResponse,expectedDiagnostics,verifyAllDone,done)
  await languageclient.openProject()
}

function verifyDiagnosticsResponse(responseMessage,expectedDiagnostics) {
  if(responseMessage==null)
    return expectedDiagnostics
  try{
    var responseUri = builder.getResponseUri(responseMessage.uri)

    var expectedDiagnosticsForFile = expectedDiagnostics.filter(function(elem, i, array) {
      return (file.getFSPath(responseUri)===file.getFSPath(elem.uri))
    });
    
    for (var rowIndex = 0; rowIndex < expectedDiagnosticsForFile.length; rowIndex++) {
      var expectedDiagnostic = expectedDiagnosticsForFile[rowIndex]
      
      gauge.message("verified "+expectedDiagnostic.uri)
      var allDiagnosticsForFile = responseMessage.diagnostics.filter(function(elem, i, array) {
        return (elem.message === expectedDiagnostic.message) && ((expectedDiagnostic.line==null || expectedDiagnostic.line=="NA") || (expectedDiagnostic.line == elem.range.start.line));
      });

      expectedDiagnostic.isValidated = true
      expectedDiagnostic.errors = []
      if(allDiagnosticsForFile.length==0)
      {        
        expectedDiagnostic.errors.push(expectedDiagnostic.message+" not found in "+JSON.stringify(responseMessage))
      }
      else{
        var diagnostic = allDiagnosticsForFile[0]
        if(diagnostic.code){
          expectedDiagnostic.code.replace(/\\\\/g,"\\")
          if(diagnostic.code!=expectedDiagnostic.code)
          {
            expectedDiagnostic.errors.push(JSON.stringify(diagnostic.code) + " not equal to " 
            + JSON.stringify(expectedDiagnostic.code));  
          }
        }
        if(expectedDiagnostic.severity)
        {
          if(diagnostic.severity!=expectedDiagnostic.severity)
            expectedDiagnostic.errors.push(JSON.stringify(diagnostic.severity) + " not equal to " 
            + JSON.stringify(expectedDiagnostic.severity));        
        }  
      }            
    }
  }
  catch(err){
    console.log(err.stack)
    gauge.message(err.stack)
  }
  finally {
    return expectedDiagnostics
  }
}

function verifyAllDone(expectedDiagnostics){
  if(expectedDiagnostics==null)
    return {errors:null,isValidated:true}
  
  var validated = expectedDiagnostics.filter(function(elem, i, array) {
    return elem.isValidated;
  });

  if(validated.length == expectedDiagnostics.length)
  {
    var errors = expectedDiagnostics.filter(function(elem, i, array) {
      return (elem.errors && elem.errors.length>0);
    });

    return {errors:errors,isValidated:true}
  }

  return {isValidated:false}  
}