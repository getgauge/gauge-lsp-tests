"use strict";

var languageclient = require('../languageclient');
var file = require('../../util/fileExtension');
var path = require('path');
var uri = require('vscode-uri').default;

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
  loadJSON:loadJSON
}