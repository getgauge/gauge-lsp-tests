var fs=require('fs')
var _languageclient = require('./lsp/languageclient')
step("playback <filePath>", async function(filePath) {
    var contents= fs.readFileSync(filePath, "utf-8");
    _languageclient.playBack(contents)
});