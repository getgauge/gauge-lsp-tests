"use strict";

var daemon = require('../daemon');
var stringExtension = require('../../util/stringExtension')

function getResponseUri(original){
  var intermediate = original.replace("file:///","");
  return intermediate.replaceAll("/","\\")
}

async function buildExpectedRange(givenResult,projectPath,uri){
  var expectedResult = [];
  
  var lineIndex = givenResult.headers.cells.indexOf('line')
  var rangeStartIndex = givenResult.headers.cells.indexOf('range_start')
  var rangeEndIndex = givenResult.headers.cells.indexOf('range_end')
  var severityIndex = givenResult.headers.cells.indexOf('severity')
  var messageIndex = givenResult.headers.cells.indexOf('message')

  for (var rowIndex = 0; rowIndex < givenResult.rows.length; rowIndex++) {
    var expectedDiagnostic = givenResult.rows[rowIndex].cells
      
    var result = await buildRange(expectedDiagnostic[lineIndex],
      expectedDiagnostic[rangeStartIndex],
      expectedDiagnostic[rangeEndIndex],
      expectedDiagnostic[severityIndex],
      expectedDiagnostic[messageIndex],projectPath,uri);
      expectedResult.push(result)
    }
  return expectedResult
}  

async function buildExpectedCodeLens(givenResult,projectPath,filePath){
  var expectedResult = [];
  
  var lineIndex = givenResult.headers.cells.indexOf('line')
  var rangeStartIndex = givenResult.headers.cells.indexOf('range_start')
  var rangeEndIndex = givenResult.headers.cells.indexOf('range_end')

  var titleIndex = givenResult.headers.cells.indexOf('title')
  var commandIndex = givenResult.headers.cells.indexOf('command')
  var argumentsIndex = givenResult.headers.cells.indexOf('arguments')

  for (var rowIndex = 0; rowIndex < givenResult.rows.length; rowIndex++) {
    var expectedDiagnostic = givenResult.rows[rowIndex].cells

    var result = await buildRange(expectedDiagnostic[lineIndex],
      expectedDiagnostic[rangeStartIndex],
      expectedDiagnostic[rangeEndIndex]);

    result.command = await buildCommand(expectedDiagnostic[titleIndex],
      expectedDiagnostic[commandIndex],
      expectedDiagnostic[argumentsIndex],
      projectPath,filePath);
  
    expectedResult.push(result)
  }
  return expectedResult
}

async function buildCommand(title,command,args,projectPath,filePath){
  var result = {}

  result.title = title
  result.command = command
  result.arguments = [];
  result.arguments.push(args.replace('%project_uri%',projectPath)
  .replace('%file_uri%',filePath))

  return result;
}

function AddProjectAndFileUri(value,projectPath,filePath){
  return value.replace('%project_uri%',projectPath)
  .replace('%file_uri%',filePath)
}

async function buildPosition(line,index){
  return {"line": parseInt(line),
  "character": parseInt(index)}
}

async function buildRange(line,rangeStart,rangeEnd,severity,message,projectPath,fileUri){
  var result = {}
  if(severity){
    result.severity = parseInt(severity)
  }
  if(message){
    result.message = AddProjectAndFileUri(message,projectPath,fileUri)
  }

  result.uri = fileUri
  result.range = {
    "start": await buildPosition(line,rangeStart),
    "end": await buildPosition(line,rangeEnd)
  };
  return result;
}
    
module.exports={
  buildExpectedRange:buildExpectedRange,
  buildExpectedCodeLens:buildExpectedCodeLens,
  getResponseUri:getResponseUri
}