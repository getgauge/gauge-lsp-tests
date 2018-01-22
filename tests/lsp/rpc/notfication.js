const rpc = require('vscode-jsonrpc');
var assert = require('assert');

async function handlerForNotifcation(res,registeredHandlers){
    var results = []
    for(var i=0;i<registeredHandlers.length;i++){
        if(registeredHandlers[i].unRegister)
            continue
        var expectedDiagnostics = await registeredHandlers[i].listener(res,registeredHandlers[i].expectedDiagnostics)
        var result = registeredHandlers[i].verifyIfDone(expectedDiagnostics);
        if(result.done)
        {
            registeredHandlers[i].done()
            registeredHandlers[i].unRegister = true    
        }    
        results.push(result)
    }
    return results;
}

async function OnNotification(notificationType,connection,registeredHandlers){  
    var results = await connection.onNotification(notificationType, async (res) => {
        return await handlerForNotifcation(res,registeredHandlers)
    });

    if(results!=null && results.length>0 && results[0].errors!=null){
        var errors = results[0].errors.filter(function(elem, i, array) {
            return elem.error.length>0;
        });
        assert.ok(errors.length==0,"errors in validating diagnostics "+JSON.stringify(errors))
    }
}

async function sendNotification(connection,method,params){
    setTimeout(function() {}, 10);
    connection.sendNotification(new rpc.NotificationType(method), params);
}

module.exports = {OnNotification:OnNotification,sendNotification:sendNotification}
