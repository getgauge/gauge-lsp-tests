var fs=require("fs");
var _playback = require("./lsp/playback");
step("playback <filePath>", function(filePath) {
  var contents= fs.readFileSync(filePath, "utf-8");
  _playback.playBack(contents);
});