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

function buildArguments(filePath,range,stepname){
  var result = [];
  
  result.push(filePath)
  result.push(range)
  result.push(stepname)

  return result;
}

function AddProjectAndFileUri(value,filePath){
  return value.replace('%project_path%%file_path%',path.join("",filePath))
}

function buildPosition(line,index){
  return {"line": parseInt(line),
  "character": parseInt(index)}
}

function buildRange(line,rangeStart,rangeEnd,filePath,severity,message,code){
  var result = {}

  if(code){
    result.code = code
  }

  if(severity){
    result.severity = parseInt(severity)
  }
  if(message){
    result.message = AddProjectAndFileUri(message,filePath).replace("%3A",":")
  }

  result.uri = file.getPath(filePath)
  result.range = {
    "start": buildPosition(line,rangeStart),
    "end": buildPosition(line,rangeEnd)
  };
  return result;
}
    
module.exports={
  getResponseUri:getResponseUri,
  loadJSON:loadJSON
}