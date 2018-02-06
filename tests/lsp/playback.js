async function playBack(contents){
    var lspRequests = processContents(contents)
    for(var i=0; i<lspRequests.length;i++){
        if(lspRequests[i].direction=='-->'){
            if(lspRequests[i].requestType=='notif')
                _notification.sendNotification(state.connection, lspRequests[i].method,lspRequests[i].params)
            else
            {
                var response = _request.sendRequest(state.connection, lspRequests[i].method,lspRequests[i].params)
            }
        }
    }
}

function processContents(contents) {
    var arrayOfLines = contents.match(/[^\r\n]+/g);
    var lspRequests = [];
    for (i = 0; i < arrayOfLines.length; i++) { 
        if(arrayOfLines[i].substring(13,16)!="-->")
            continue;

        var lsp= {timestamp:"",direction:"",requestType:"", method:"",params:"",timeToWait:""};
        lsp.timestamp = arrayOfLines[i].substring(0,13).trim();
        if(i!=0){
            var current = '2000-12-17T'+lsp.timestamp
            var previous = '2000-12-17T'+arrayOfLines[i-1].substring(0,13).trim()
            lsp.timeToWait = new Date(current) - new Date(previous);
        }
        else lsp.timeToWait = 0
        lsp.direction = arrayOfLines[i].substring(13,16);

        var otherDetails = arrayOfLines[i].substring(17);
        var requestTypeLength = otherDetails.indexOf(":");
        lsp.requestType= otherDetails.substring(0,requestTypeLength);

        var methodAndParams = otherDetails.substring(requestTypeLength+1)
        var methodLength = methodAndParams.indexOf(":");

        lsp.method= methodAndParams.substring(0, methodLength)
        lsp.params= methodAndParams.substring(methodLength+1)

        lspRequests.push(lsp)
    }
    return lspRequests
}   

module.exports = {
    playBack:playBack,
}