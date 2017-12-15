var daemon = require('./lsp/daemon');
var table = require('./util/table');
var file = require('./util/fileExtension');
var notification = require('./lsp/notification');
var path = require('path')

step('open file <filePath>', async function (filePath) {
    const content = file.parseContent(path.join(daemon.projectPath(), filePath))
    gauge.dataStore.scenarioStore.put('currentFilePath', filePath);
    
    try{
        await notification.openFile({
            path: filePath,
            content: content
        }, daemon.connection(), daemon.projectPath());    
    }
    catch(err){
        assert.fail("error not expected "+err)
    }
});