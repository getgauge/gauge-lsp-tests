var tmp = require('tmp');
var ncp = require('ncp').ncp;

var file = require('./util/fileExtension')
var tmpobj; 

async function createTempDirectory(data,cb){
    tmpobj = tmp.dirSync();
    var response = await ncp(data, tmpobj.name,cb); 
    return tmpobj.name;    
}

function getTempDirectoryName(){
    return tmpobj.name;
}

function removeTempDirectory(){
    if(tmpobj)
        tmpobj.removeCallback();
}

module.exports={
    createTempDirectory:createTempDirectory,
    getTempDirectoryName:getTempDirectoryName,
    removeTempDirectory:removeTempDirectory    
}