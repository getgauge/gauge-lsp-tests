'use strict';
var assert = require('assert');
var languageclient = require('./lsp/languageclient');
var builder = require('./lsp/util/dataBuilder');
var _gauge = require('./lsp/gauge');
var _customLSP = require('./lsp/customLSP');
var _fileExtension = require('./util/fileExtension');
var path = require('path');

step('ensure spec code lens has details <data>', async function (data) {
    var details = builder.buildCodeLens(data,languageclient.filePath)
    var file = details.input.uri

    try {
        var response = await languageclient.codeLens(file)
        handleCodeLensDetails(response, details.result, (d, r) => d.command.title == r.command.title,(filePath)=>{
            return path.join(languageclient.projectPath(),filePath)
        })
    }
    catch (err) {
        console.log(err.stack)
        gauge.message(err.stack)
        throw new Error("unable to verify code lens details " + err)
    }
});

step('ensure reference code lens has details <data>', async function (data) {
    var details = builder.buildCodeLens(data,languageclient.filePath)
    var file = details.input.uri

    try {
        var response = await languageclient.codeLens(file)
        handleCodeLensDetails(response, details.result, (d, r) => d.command.arguments[2] == r.command.arguments[2],(filePath)=>{
            return _fileExtension.getUri(path.join(languageclient.projectPath(),filePath))
        })
    }
    catch (err) {
        console.log(err.stack)
        gauge.message(err.stack)

        throw new Error("unable to verify code lens details " + err)
    }
});


function handleCodeLensDetails(responseMessage, expectedDetails, filterMethod,pathMethod) {
    for (var rowIndex = 0; rowIndex < responseMessage.length; rowIndex++) {
        var expectedDetail = expectedDetails.find((d) => filterMethod(d, responseMessage[rowIndex]))
        gauge.message("verify code lens details")
        expectedDetail.command.arguments[0] =  pathMethod(expectedDetail.command.arguments[0])
        var message = "expected " + JSON.stringify(expectedDetail) + " actual " + JSON.stringify(responseMessage[rowIndex]);

        assert.deepEqual(responseMessage[rowIndex].range, expectedDetail.range, message);

        assert.equal(responseMessage[rowIndex].command.title, expectedDetail.command.title, message)
        assert.equal(responseMessage[rowIndex].command.command, expectedDetail.command.command, message)

        // TODO file path assertion
        assert.equal(responseMessage[rowIndex].command.arguments[0],expectedDetail.command.arguments[0],
          responseMessage[rowIndex].command.arguments[0]+" should be "+expectedDetail.command.arguments[0])
        if (responseMessage[rowIndex].command.arguments[1])
            assert.deepEqual(responseMessage[rowIndex].command.arguments[1], expectedDetail.command.arguments[1], message)
        assert.equal(responseMessage[rowIndex].command.arguments[2], expectedDetail.command.arguments[2], message)
    }
}

step("run all specifications", async function () {
	await _gauge.runSpecs(languageclient.projectPath())
});

step("the execution status of <directoryPath> should be <expectedDetails>", async function(directoryPath,expectedDetails) {
    _customLSP.getExecutionStatus();
    var executionStatusFile = languageclient.filePath(".gauge/executionStatus.json");
    var expected = JSON.parse(expectedDetails)
    var actual = JSON.parse(_fileExtension.parseContent(executionStatusFile))
    assert.deepEqual(actual,expected)
});
