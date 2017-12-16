"use strict";

var daemon = require('../daemon');
var stringExtension = require('../../util/stringExtension');
var file = require('../../util/fileExtension');
var path = require('path');
var uri = require('vscode-uri').default;

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

function buildExpectedCodeLens(givenResult){
  var expectedResult = [];
  
  var lineIndex = givenResult.headers.cells.indexOf('line')
  var rangeStartIndex = givenResult.headers.cells.indexOf('range_start')
  var rangeEndIndex = givenResult.headers.cells.indexOf('range_end')

  var titleIndex = givenResult.headers.cells.indexOf('title')
  var commandIndex = givenResult.headers.cells.indexOf('command')
  var argumentsIndex = givenResult.headers.cells.indexOf('arguments')
  var filePathIndex = givenResult.headers.cells.indexOf('uri')

  for (var rowIndex = 0; rowIndex < givenResult.rows.length; rowIndex++) {
    var expectedDiagnostic = givenResult.rows[rowIndex].cells

    var result = buildRange(expectedDiagnostic[lineIndex],
      expectedDiagnostic[rangeStartIndex],
      expectedDiagnostic[rangeEndIndex],
      path.join(daemon.projectPath(),expectedDiagnostic[filePathIndex]));

    result.command = buildCommand(expectedDiagnostic[titleIndex],
      expectedDiagnostic[commandIndex],
      expectedDiagnostic[argumentsIndex],
      daemon.projectPath(),expectedDiagnostic[filePathIndex]);
  
    expectedResult.push(result)
  }
  return expectedResult
}

function buildCommand(title,command,args,projectPath,filePath){
  var result = {}

  result.title = title
  result.command = command
  result.arguments = [];
  result.arguments.push(args.replace('%project_path%',projectPath)
  .replace('%file_path%',filePath))

  return result;
}

function AddProjectAndFileUri(value,filePath){
  return value.replace('%project_path%%file_path%',path.join("",filePath))
}

function buildPosition(line,index){
  return {"line": parseInt(line),
  "character": parseInt(index)}
}

function buildRange(line,rangeStart,rangeEnd,filePath,severity,message){
  var result = {}
  
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
  buildExpectedRange:buildExpectedRange,
  buildExpectedCodeLens:buildExpectedCodeLens,
  getResponseUri:getResponseUri
}