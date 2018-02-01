'use strict';
var assert = require('assert');

var languageclient = require('./lsp/languageclient');
var builder = require('./lsp/util/dataBuilder');

step("should be able to find usages in <details> second(s) for data <data>", async function(details, data) {
    var details = builder.loadData(data)
    var file = details[0].uri
    var start = Date.now()  
    var response;

    try{
        response = await languageclient.codeLens(file)
    }
    catch(err){
        throw new Error("unable to verify code lens details "+err)
    }
    finally{
        var end = Date.now()
        console.log(end-start+" milliseconds")
        // console.log(response)
    }
});

step('ensure code lens has details <data>', async function (data) {
    var details = builder.loadData(data)

    var expectedDetails = builder.buildExpectedCodeLens(details);  
    var file = details[0].uri

    try{
        var response = await languageclient.codeLens(file)
        handleCodeLensDetails(response,expectedDetails)    
    }
    catch(err){
        throw new Error("unable to verify code lens details "+err)
    }
});

function handleCodeLensDetails(responseMessage,expectedDetails){
    for (var rowIndex = 0; rowIndex < expectedDetails.length; rowIndex++) {
      var expectedDetail = expectedDetails[rowIndex]
      gauge.message("verify code lens details")

      assert.deepEqual(responseMessage[rowIndex].range, expectedDetail.range);

      assert.equal(responseMessage[rowIndex].command.title, expectedDetail.command.title)
      assert.equal(responseMessage[rowIndex].command.command, expectedDetail.command.command)

      // Todo refactor the way arguments are asserted
      //      assert.equal(responseMessage[rowIndex].command.arguments[0], expectedDetail.command.arguments[0])
      if(responseMessage[rowIndex].command.arguments[1])
          assert.deepEqual(responseMessage[rowIndex].command.arguments[1], expectedDetail.command.arguments[1])
      assert.equal(responseMessage[rowIndex].command.arguments[2], expectedDetail.command.arguments[2])    
    }  
}