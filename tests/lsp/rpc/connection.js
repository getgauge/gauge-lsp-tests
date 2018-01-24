const rpc = require('vscode-jsonrpc');
const Logger = require('./logger').Logger
function newConnection(process){
    var reader = new rpc.StreamMessageReader(process.stdout);
    var writer = new rpc.StreamMessageWriter(process.stdin);
    var logger = new Logger();

    let connection = rpc.createMessageConnection(reader, writer,logger);
    connection.onError()
    connection.listen();
    return {connection:connection,logger:logger};
}



module.exports = {newConnection:newConnection}