"use strict";

var assert = require('assert');

var languageclient = require('./lsp/languageclient');

step("format file <filePath> and ensure formatted contents are <afterFormat>", async function(filePath, expected) {
    try{
        var response = await languageclient.formatFile(filePath, languageclient.projectPath())
        verifyFormattedDetails(response, expected)        
    }
    catch(err){
        throw new Error('unable to verify format '+err)
    }
});

function verifyFormattedDetails(actual,expected){        
    if(!String.prototype.replaceAll){
        String.prototype.replaceAll = function(search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, 'g'), replacement);
        }
      }

    gauge.message("verify format details")
    assert.equal(actual[0].newText,expected.replaceAll("\r\n","\n"))
}