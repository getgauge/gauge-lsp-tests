"use strict";

const rpc = require('vscode-jsonrpc');

async function sendRequest(connection,method,params,token){
  console.log(method)
  console.log(params)
  if(token)
    return connection.sendRequest(method, params,token);
  else
    return connection.sendRequest(method, params);
}

function onRequest(connection,method,params){
  return connection.onRequest(method, params);
}

module.exports = {
  sendRequest:sendRequest,
  onRequest:onRequest
};