var daemon = require('./lsp/daemon');
var table = require('./util/table');
var notification = require('./lsp/notification');
var fs = require('fs');
var path = require('path')

step('open file <filePath>', async function (filePath) {
    const content = parseContent(path.join(daemon.projectPath(), filePath))
    gauge.dataStore.scenarioStore.put('currentFilePath', filePath);
    
    await notification.openFile({
        path: filePath,
        content: content
    }, daemon.connection(), daemon.projectPath());
});

function parseContent(file) {
    return fs.readFileSync(file, "utf-8");
}