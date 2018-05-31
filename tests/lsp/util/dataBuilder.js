"use strict";

var languageclient = require('../languageclient');
var file = require('../../util/fileExtension');
var uri = require('vscode-uri').default;

function buildCodeAction(data){
  var codeActions = loadJSON(data)
  if(codeActions.result){
    codeActions.result.forEach(codeAction => {
      codeAction.arguments.forEach(argument=>{
        if(argument.conceptName)
          argument.conceptName =  updateSpecsDir(argument.conceptName)
      })
    });  
  }
  return codeActions
}

function buildDiagnostics(data){
  var diagnostics = loadJSON(data)
  diagnostics.forEach(diagnostic => {
    diagnostic.uri =  updateSpecsDir(diagnostic.uri)
  })
  return diagnostics
}

function buildRefactor(data){
  var refactorDetails = loadJSON(data)
  var keys = Object.keys(refactorDetails.result.changes)
  keys.forEach(key=>{
    var value = refactorDetails.result.changes[key]
    delete refactorDetails.result.changes[key]
    var newKey =  updateSpecsDir(key)
    refactorDetails.result.changes[newKey] = value
  })
  return refactorDetails
}

function buildCodeLens(data){
  var codeLensDetails = loadJSON(data)

  codeLensDetails.result.forEach(result=>{
    var keys = Object.keys(result.command.arguments)
    keys.forEach(key=>{
      var value = result.command.arguments[key]
      if((typeof value)==='string')
        result.command.arguments[key] = updateSpecsDir(value)
    })  
  })
  return codeLensDetails
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

function updateSpecsDir(path){
  return path.replace('$specs','specifications')
}
    
module.exports={
  getResponseUri:getResponseUri,
  loadJSON:loadJSON,
  buildCodeLens:buildCodeLens,
  buildCodeAction:buildCodeAction,
  buildDiagnostics:buildDiagnostics,
  buildRefactor:buildRefactor,
  updateSpecsDir:updateSpecsDir
}