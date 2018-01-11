const rpc = require('vscode-jsonrpc');

function newConnection(process){
    var reader = new rpc.StreamMessageReader(process.stdout);
    var writer = new rpc.StreamMessageWriter(process.stdin);

    let connection = rpc.createMessageConnection(reader, writer);
    connection.listen();
    return connection;
}

module.exports = {newConnection:newConnection}