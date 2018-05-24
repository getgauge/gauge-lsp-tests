"use strict";

var languageclient = require('../languageclient');
var file = require('../../util/fileExtension');
var path = require('path');
var uri = require('vscode-uri').default;

function buildCodeAction(data){
  //        [{"conceptName":"# another scenario \u003ctable:$specs/some.csv\u003e\n* ","conceptFile":"","dir":""}]
  var codeActions = loadJSON(data)
  if(codeActions.result){
    codeActions.result.forEach(codeAction => {
      codeAction.arguments.forEach(argument=>{
        if(argument.conceptName)
          argument.conceptName = argument.conceptName.replace('$specs',process.env.gauge_specs_dir)
      })
    });  
  }
  return codeActions
}

function buildDiagnostics(data){
  var diagnostics = loadJSON(data)
  diagnostics.forEach(diagnostic => {
    diagnostic.uri = diagnostic.uri.replace('$specs',process.env.gauge_specs_dir)
  })
  return diagnostics
}

function buildRefactor(data){
  var refactorDetails = loadJSON(data)
  var keys = Object.keys(refactorDetails.result.changes)
  keys.forEach(key=>{
    var value = refactorDetails.result.changes[key]
    delete refactorDetails.result.changes[key]
    var newKey = key.replace('$specs',process.env.gauge_specs_dir)
    refactorDetails.result.changes[newKey] = value
  })
  return refactorDetails
}

function loadJSON(data){
  if(!data.endsWith('.json'))
    return JSON.parse(file.parseContent(data+"/"+process.env.language+"_impl.json"));      
  else
    return JSON.parse(file.parseContent(data))
}

function getResponseUri(original){
  return uri.parse(original).fsPath
}

function buildPosition(line,index){
  return {"line": parseInt(line),
  "character": parseInt(index)}
}
    
module.exports={
  getResponseUri:getResponseUri,
  loadJSON:loadJSON,
  buildCodeAction:buildCodeAction,
  buildDiagnostics:buildDiagnostics,
  buildRefactor:buildRefactor
}