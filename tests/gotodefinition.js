"use strict";

var assert = require('assert');
const rpc = require('vscode-jsonrpc');
var path = require('path')
var daemon = require('./lsp/daemon');
var notification = require('./lsp/notifications/notification');
var request = require('./lsp/requests/request');
var table = require('./util/table');
var definitionDetails;

step('goto definition of <element> at <lineNumber> and <characterNumber> should give details <details>',async function(element,lineNumber,characterNumber,details,done){
    var currentFilePath = gauge.dataStore.scenarioStore.get('currentFilePath');
    
    await request.goto_definition(
        {lineNumber:parseInt(lineNumber),characterNumber:parseInt(characterNumber)},
        path.join(daemon.projectUri() , currentFilePath), 
        daemon.connection());  

    definitionDetails = details    
    daemon.handle(handleDefinitionResponse, done);     
    sleep(1000);   
});

async function handleDefinitionResponse(resp,done) {
    if(resp.result){
        var responseMessage = resp.result
        
        var lineIndex = definitionDetails.headers.cells.indexOf('line')
        var rangeStartIndex = definitionDetails.headers.cells.indexOf('range_start')
        var rangeEndIndex = definitionDetails.headers.cells.indexOf('range_end')
        var uriIndex = definitionDetails.headers.cells.indexOf('uri')
        var definitionDetail = definitionDetails.rows[0].cells
    
        var result = {
        "range": {
            "start": {
            "line": parseInt(definitionDetail[lineIndex]),
            "character": parseInt(definitionDetail[rangeStartIndex])
            },
            "end": { "line": parseInt(definitionDetail[lineIndex]), "character": parseInt(definitionDetail[rangeEndIndex]) }
        },
        "uri": path.join(daemon.projectUri() , definitionDetail[uriIndex])
        };

        String.prototype.replaceAll = function(search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, 'g'), replacement);
        };
    
        var responseUri = responseMessage.uri.replace("file:///","").replaceAll("/","\\");
        assert.equal(responseUri,result.uri,("response Message uri %s should be equal to %s",responseUri,result.uri))        
        assert.deepEqual(responseMessage.range, result.range, JSON.stringify(responseMessage.range) + " not equal to " + JSON.stringify(result.range));      
    }    
}

function sleep(ms) {  
  var dt = new Date();  
  dt.setTime(dt.getTime() + ms);  
  while (new Date().getTime() < dt.getTime()); 
} 