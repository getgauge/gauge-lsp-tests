'use strict';
var assert = require('assert');
var languageclient = require('./lsp/languageclient');
var builder = require('./lsp/util/dataBuilder');

step('ensure code lens has details <data>', async function (data) {
    var details = builder.loadJSON(data)
    var file = details.input.uri

    try{
        var response = await languageclient.codeLens(file)
        handleCodeLensDetails(response,details.result)    
    }
    catch(err){
        throw new Error("unable to verify code lens details "+err)
    }
});

function handleCodeLensDetails(responseMessage,expectedDetails){
    for (var rowIndex = 0; rowIndex < expectedDetails.length; rowIndex++) {
      var expectedDetail = expectedDetails[rowIndex]
      gauge.message("verify code lens details")
      var message = "expected "+JSON.stringify(expectedDetail) +" actual "+ JSON.stringify(responseMessage[rowIndex]);

      assert.deepEqual(responseMessage[rowIndex].range, expectedDetail.range,message);

      assert.equal(responseMessage[rowIndex].command.title, expectedDetail.command.title,message)
      assert.equal(responseMessage[rowIndex].command.command, expectedDetail.command.command,message)

    // TODO file path assertion
    //   assert.ok(responseMessage[rowIndex].command.arguments[0].endsWith(expectedDetail.command.arguments[0]),
    //   responseMessage[rowIndex].command.arguments[0]+" should end with "+expectedDetail.command.arguments[0])
      if(responseMessage[rowIndex].command.arguments[1])
          assert.deepEqual(responseMessage[rowIndex].command.arguments[1], expectedDetail.command.arguments[1],message)
      assert.equal(responseMessage[rowIndex].command.arguments[2], expectedDetail.command.arguments[2],message)    
    }  
}