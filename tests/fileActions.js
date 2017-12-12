var daemon = require('./lsp/daemon');
var table = require('./util/table');
var notification = require('./lsp/notification');

step('open file <filePath> <contents>', async function (filePath, contents) {
    var content = table.tableToArray(contents).Content.join('\n');
    gauge.dataStore.scenarioStore.put('currentFilePath', filePath);
    
    await notification.openFile({
        path: filePath,
        content: content
    }, daemon.connection(), daemon.projectPathEncoded());
});