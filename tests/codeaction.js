'use strict';
var assert = require('assert');
var languageclient = require('./lsp/languageclient');
var builder = require('./lsp/util/dataBuilder');
var _gauge = require('./lsp/gauge');
var _customLSP = require('./lsp/customLSP');
var _fileExtension = require('./util/fileExtension');
var path = require('path');

step("invoke code action details <details>", async function(details) {
    var details = builder.buildCodeAction(details)
	var file = details.input.uri
	var range = details.input.range
	var diagnostics = details.input.diagnostics

    try {
        var response = await languageclient.codeAction(file,range,diagnostics)
        handleCodeActionDetails(response, details.result, (d, r) => d.title == r.title)
    }
    catch (err) {
        console.log(err.stack)
        gauge.message(err.stack)
        throw new Error("unable to verify code action details " + err)
    }
});

function handleCodeActionDetails(responseMessage, expectedDetails, filterMethod) {
    if(expectedDetails==null)
    {
        assert.equal(responseMessage, expectedDetail, "expected null but was "+responseMessage)
        gauge.message("verify code action details is null")        
        return
    }
    for (var rowIndex = 0; rowIndex < responseMessage.length; rowIndex++) {
        var expectedDetail = expectedDetails.find((d) => filterMethod(d, responseMessage[rowIndex]))
        gauge.message("verify code action details")
        var message = "expected " + JSON.stringify(expectedDetail) + " actual " + JSON.stringify(responseMessage[rowIndex]);

        assert.deepEqual(responseMessage[rowIndex].range, expectedDetail.range, message);

        assert.equal(responseMessage[rowIndex].command, expectedDetail.command, message)
        assert.deepEqual(responseMessage[rowIndex].arguments, expectedDetail.arguments, message)
    }
}