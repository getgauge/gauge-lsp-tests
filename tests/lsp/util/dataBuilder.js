"use strict";

var languageclient = require('../languageclient');
var file = require('../../util/fileExtension');
var path = require('path');
var uri = require('vscode-uri').default;
var YAML = require('yamljs');

function loadData(data){
  if(!data.endsWith('.yaml'))
    return YAML.load(data+"/"+process.env.language+"_impl.yaml");      
  else
    return YAML.load(data)
}

function getResponseUri(original){
  return uri.parse(original).fsPath
}

function buildExpectedRange(givenResult,projectPath){
  var expectedResult = [];
  
  var lineIndex = givenResult.headers.cells.indexOf('line')
  var rangeStartIndex = givenResult.headers.cells.indexOf('range_start')
  var rangeEndIndex = givenResult.headers.cells.indexOf('range_end')
  var severityIndex = givenResult.headers.cells.indexOf('severity')
  var messageIndex = givenResult.headers.cells.indexOf('message')
  var uriIndex = givenResult.headers.cells.indexOf("uri")

  for (var rowIndex = 0; rowIndex < givenResult.rows.length; rowIndex++) {
    var expectedDiagnostic = givenResult.rows[rowIndex].cells
      
    var result = buildRange(expectedDiagnostic[lineIndex],
      expectedDiagnostic[rangeStartIndex],
      expectedDiagnostic[rangeEndIndex],
      path.join(projectPath, expectedDiagnostic[uriIndex]),
      expectedDiagnostic[severityIndex],
      expectedDiagnostic[messageIndex]);

      expectedResult.push(result)
    }

    return expectedResult
}  

function buildRangeFromYAML(givenResult,projectPath){
  var expectedResult = [];
  
  for (var rowIndex = 0; rowIndex < givenResult.length; rowIndex++) {
    var expectedDiagnostic = givenResult[rowIndex]
      
    var result = buildRange(expectedDiagnostic.line,
      expectedDiagnostic.rangeStart,
      expectedDiagnostic.rangeEnd,
      path.join(projectPath, expectedDiagnostic.uri),
      expectedDiagnostic.severity,
      expectedDiagnostic.message,
    expectedDiagnostic.code);

      expectedResult.push(result)
    }

    return expectedResult
}  

function buildExpectedCodeLens(givenResult){
  var expectedResult = [];
  
  for (var rowIndex = 0; rowIndex < givenResult.length; rowIndex++) {
    var expectedDiagnostic = givenResult[rowIndex]

    var result = buildRange(expectedDiagnostic.line,
      expectedDiagnostic.range_start,
      expectedDiagnostic.range_end,
      languageclient.filePath(expectedDiagnostic.uri));

      result.command = {}
      result.command.title = expectedDiagnostic.title
      result.command.command = expectedDiagnostic.command
      result.command.arguments = buildArguments(file.getFullPath(languageclient.projectPath(),expectedDiagnostic.uri),
      {line:expectedDiagnostic.line,character:expectedDiagnostic.range_start},
      expectedDiagnostic.stepname);

    expectedResult.push(result)
  }
  return expectedResult
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
  buildRangeFromYAML:buildRangeFromYAML,
  buildExpectedRange:buildExpectedRange,
  buildExpectedCodeLens:buildExpectedCodeLens,
  getResponseUri:getResponseUri,
  loadData:loadData
}