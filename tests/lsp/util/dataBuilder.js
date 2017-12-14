"use strict";

var daemon = require('../daemon');
var stringExtension = require('../../util/stringExtension');
var path = require('path');
var uri = require('vscode-uri').default;

function getResponseUri(original){
  return uri.parse(original).fsPath
}

function buildExpectedRange(givenResult,uri){
  var expectedResult = [];
  
  var lineIndex = givenResult.headers.cells.indexOf('line')
  var rangeStartIndex = givenResult.headers.cells.indexOf('range_start')
  var rangeEndIndex = givenResult.headers.cells.indexOf('range_end')
  var severityIndex = givenResult.headers.cells.indexOf('severity')
  var messageIndex = givenResult.headers.cells.indexOf('message')

  for (var rowIndex = 0; rowIndex < givenResult.rows.length; rowIndex++) {
    var expectedDiagnostic = givenResult.rows[rowIndex].cells
      
    var result = buildRange(expectedDiagnostic[lineIndex],
      expectedDiagnostic[rangeStartIndex],
      expectedDiagnostic[rangeEndIndex],
      expectedDiagnostic[severityIndex],
      expectedDiagnostic[messageIndex],uri);
      expectedResult.push(result)
    }
  return expectedResult
}  

function buildExpectedCodeLens(givenResult,projectPath,filePath){
  var expectedResult = [];
  
  var lineIndex = givenResult.headers.cells.indexOf('line')
  var rangeStartIndex = givenResult.headers.cells.indexOf('range_start')
  var rangeEndIndex = givenResult.headers.cells.indexOf('range_end')

  var titleIndex = givenResult.headers.cells.indexOf('title')
  var commandIndex = givenResult.headers.cells.indexOf('command')
  var argumentsIndex = givenResult.headers.cells.indexOf('arguments')

  for (var rowIndex = 0; rowIndex < givenResult.rows.length; rowIndex++) {
    var expectedDiagnostic = givenResult.rows[rowIndex].cells

    var result = buildRange(expectedDiagnostic[lineIndex],
      expectedDiagnostic[rangeStartIndex],
      expectedDiagnostic[rangeEndIndex],path.join(projectPath,filePath));

    result.command = buildCommand(expectedDiagnostic[titleIndex],
      expectedDiagnostic[commandIndex],
      expectedDiagnostic[argumentsIndex],
      projectPath,filePath);
  
    expectedResult.push(result)
  }
  return expectedResult
}

function buildCommand(title,command,args,projectPath,filePath){
  var result = {}

  result.title = title
  result.command = command
  result.arguments = [];
  result.arguments.push(args.replace('%project_uri%',projectPath)
  .replace('%file_uri%',filePath))

  return result;
}

function AddProjectAndFileUri(value,filePath){
  return value.replace('%file_uri%',path.join("",filePath))
}

function buildPosition(line,index){
  return {"line": parseInt(line),
  "character": parseInt(index)}
}

function buildRange(line,rangeStart,rangeEnd,severity,message,fileUri){
  var result = {}
  if(severity){
    result.severity = parseInt(severity)
  }
  if(message){
    result.message = AddProjectAndFileUri(message,fileUri).replace("%3A",":")
  }

  result.uri = fileUri
  result.range = {
    "start": buildPosition(line,rangeStart),
    "end": buildPosition(line,rangeEnd)
  };
  return result;
}
    
module.exports={
  buildExpectedRange:buildExpectedRange,
  buildExpectedCodeLens:buildExpectedCodeLens,
  getResponseUri:getResponseUri
}