"use strict";

const rpc = require('vscode-jsonrpc');

async function sendRequest(connection,method,params,token){
  if(token)
    return connection.sendRequest(new rpc.RequestType(method), params,token);
  else
    return connection.sendRequest(new rpc.RequestType(method), params);  
}

function onRequest(connection,method,params){
  return connection.onRequest(new rpc.RequestType(method), params);
}

module.exports = {
  sendRequest:sendRequest,
  onRequest:onRequest
};