var daemon = require('./lsp/daemon');
var table = require('./util/table');
var file = require('./util/fileExtension');
var notification = require('./lsp/notification');
var path = require('path')

step('open file <relativeFilePath>', async function (relativeFilePath) {
    const filePath = daemon.filePath(relativeFilePath)
    const content = file.parseContent(filePath)
    
    try{
        await notification.openFile(filePath, content, daemon.connection());    
    }
    catch(err){
        throw new Error("unable to open file "+err)
    }
});

step('open file <relativeFilePath> with content <content>', async function (relativeFilePath,beforeFormatFile) {
    const filePath = daemon.filePath(relativeFilePath)
    const content = file.parseContent(daemon.filePath(beforeFormatFile))
    
    try{
        await notification.openFile(relativeFilePath,content,daemon.connection());    
    }
    catch(err){
        throw new Error("unable to open file "+err)
    }
});