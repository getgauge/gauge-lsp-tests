"use strict";

const rpc = require('vscode-jsonrpc');
const uri = require('vscode-uri').default;

async function codeLens(fileUri, connection) {
  try{
    return await request(null,fileUri,connection,'textDocument/codeLens')    
  } catch (error) {
    return Promise.reject(error);
  }
}

async function codecomplete(position, fileUri, connection) {
  try{
    return await request(position,fileUri,connection,'textDocument/completion')
  } catch (error) {
    return Promise.reject(error);
  }
}

async function request(position, fileUri, connection,requestType) {
  var messageParams = {}
  if(position){
    messageParams.position = {
      "line": parseInt(position.lineNumber),
      "character": parseInt(position.characterNumber)
    }
  }
  messageParams.textDocument = { 
    "uri": uri.file(fileUri).toString().replace('%25','%')
  };
  var request = new rpc.RequestType(requestType)

  return await connection.sendRequest(request, messageParams, null);
}

async function gotoDefinition(position, fileUri, connection) {
//  try{
  return await request(position,fileUri,connection,'textDocument/definition')
  // } catch (error) {
  //   console.log("herere**************"+error)
  //   return Promise.reject(error);
  // }
}

module.exports = {
  codecomplete: codecomplete,
  gotoDefinition:gotoDefinition,
  codeLens:codeLens
};  