"use strict";

const rpc = require('vscode-jsonrpc');
const uri = require('vscode-uri').default;

async function codeLens(fileUri, connection) {
  return await request(fileUri,connection,'textDocument/codeLens')    
}

async function codecomplete(position, fileUri, connection) {
  return await request(fileUri,connection,'textDocument/completion',position)
}

async function request(fileUri, connection,requestType,position,options) {
  var messageParams = {}
  if(position){
    messageParams.position = {
      "line": parseInt(position.lineNumber),
      "character": parseInt(position.characterNumber)
    }
  }

  if(options)
    messageParams.options = options
  
  messageParams.textDocument = { 
    "uri": uri.file(fileUri).toString().replace('%25','%')
  };
  var request = new rpc.RequestType(requestType)

  return await connection.sendRequest(request, messageParams, null);
}

async function gotoDefinition(position, fileUri, connection) {
  return await request(fileUri,connection,'textDocument/definition',position)
}

async function formatFile(fileUri, connection) {  
  return await request(fileUri,connection,'textDocument/formatting',null,{
    "tabSize":4,
    "insertSpaces":true
  })  
}

module.exports = {
  codecomplete: codecomplete,
  gotoDefinition:gotoDefinition,
  codeLens:codeLens,
  formatFile:formatFile
};  