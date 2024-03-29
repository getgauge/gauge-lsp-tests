const rpc = require("vscode-jsonrpc");
var assert = require("assert");

function handleNotifcation(res,registeredHandlers){
  var results = [];
  for(const element of registeredHandlers){
    if(element.unRegister)
      continue;
    var expectedDiagnostics = element.listener(res,element.expectedDiagnostics);
    var result = element.verifyIfDone(expectedDiagnostics);
    if(result.isValidated)
    {
      element.done();
      element.unRegister = true;    
    }    
    results.push(result);
  }
  return results;
}

async function OnNotification(notificationType,connection,registeredHandlers){
  await connection.onNotification(notificationType, (res) => {
    var results = handleNotifcation(res,registeredHandlers);

    if(results!=null && results.length>0 && results[0].errors!=null){
      var errors = [];
      for(const element of results){
        for(const error of element.errors) {
          errors.push(error);
        }
      }

      assert.ok(errors.length==0,"diagnostics has errors "+JSON.stringify(errors));
    }
  });
}

function sendNotification(connection,method,params){
  connection.sendNotification(new rpc.NotificationType(method), params);
}

module.exports = {OnNotification:OnNotification,sendNotification:sendNotification};
