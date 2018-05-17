var vscodeUri = require('vscode-uri').default
var path = require('path')

var cwd = process.cwd();
var fs = require('fs');

function getUri(filePath){
    return vscodeUri.file(filePath).toString().replace('%25','%')
}

function getPath(path1, file){
    if(file)
        return vscodeUri.file(path.join(path1,file)).path;
    return vscodeUri.file(path1).path;
}

function parseContent(file) {
    return fs.readFileSync(file, "utf-8");
}

function write(file, content) {
    return fs.writeFileSync(file, content);
}

function save(file,contentFile){
    fs.writeFileSync(file,parseContent(contentFile))
}

function openFile(file){
    return fs.openSync(file,'r')
}

function copyFile(from, to){
    fs.copyFileSync(from, to);
}

function rmContentsOfDir(dirPath) {
    try { 
        var files = fs.readdirSync(dirPath); 
    }
    catch(e) { 
        console.log("error occured"+ JSON.stringify(e))
        return; 
    }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = path.join(dirPath , files[i]);
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
            {
                rmContentsOfDir(filePath);
            }
        }
};

function rmDir(dirPath) {
    try { 
        var files = fs.readdirSync(dirPath); 
    }
    catch(e) { 
        console.log("error occured"+ JSON.stringify(e))
        return; 
    }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = path.join(dirPath , files[i]);
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
            {
                rmDir(filePath);
                fs.rmdirSync(filePath);
            }
        }
    rmDir(dirPath);
};

module.exports={
    getUri:getUri,
    getPath:getPath,
    parseContent:parseContent,
    copyFile:copyFile,
    write: write,
    save:save,
    rmContentsOfDir:rmContentsOfDir,
    rmDir:rmDir,
    openFile:openFile
}