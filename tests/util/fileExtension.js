var vscodeUri = require('vscode-uri').default
var path = require('path')
var cwd = process.cwd();
var fs = require('fs');

function getFullPath(relativePath, file){
    if(file)
        return vscodeUri.file(path.join(cwd, relativePath,file)).fsPath;
    return vscodeUri.file(path.join(cwd, relativePath)).fsPath;        
}

function getPath(path1, file){
    if(file)
        return vscodeUri.file(path.join(path1,file)).path;
    return vscodeUri.file(path1).path;
}

function parseContent(file) {
    return fs.readFileSync(file, "utf-8");
}

module.exports={getFullPath:getFullPath,
getPath:getPath,
parseContent:parseContent}