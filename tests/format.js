"use strict";

var assert = require('assert');
const rpc = require('vscode-jsonrpc');
var path = require('path');
var daemon = require('./lsp/daemon');
var request = require('./lsp/request');
var table = require('./util/table');
var string = require('./util/stringExtension');
var builder = require('./lsp/util/dataBuilder');

step("format file <filePath> and ensure formatted contents are <afterFormat>", async function(filePath, expected) {
    //const expected = afterFormat.join("\n")
    var response = await request.formatFile(path.join(daemon.projectPath(),filePath), daemon.connection(), daemon.projectPath())
    await verifyFormattedDetails(response, expected)    
});

async function verifyFormattedDetails(actual,expected){        
    if(!String.prototype.replaceAll){
        String.prototype.replaceAll = function(search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, 'g'), replacement);
        }
      }

    gauge.message("verify format details")
    assert.equal(actual[0].newText,expected.replaceAll("\r\n","\n"))
}