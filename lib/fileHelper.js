import fs from "fs";

const mainDir = './data';
const check_make_dir = function(user,subDir){
    if (!fs.existsSync(mainDir+"/"+user)){
        fs.mkdirSync(mainDir+"/"+user);
    }
    if(!fs.existsSync(mainDir+"/"+user+"/"+subDir)){
        fs.mkdirSync(mainDir+"/"+user+"/"+subDir);
    }
    return mainDir+"/"+user+"/"+subDir+"/";
};
exports.uploadFileForUser = function(user,subDir,files){
    //check for input
    if (!files)
        return {status:400, res:"file not uploaded"};
    //create folders if needed
    var path = check_make_dir(user,subDir) + file;
    for (var file in files) {
        files[file].mv(path, function(err) {
            if (err)
                return {status:500, res:err};
            return {status:200, res:'success'};
        });
    }
};

exports.fileUpload = async function(file,user,subDir){
    const { stream, filename, mimetype } = await file;
    var path = check_make_dir(user,subDir)+filename;

    const res = await new Promise((resolve, reject) =>
        stream
            .on('error', error => {
                if (stream.truncated)
                // Delete the truncated file
                    fs.unlinkSync(path);
                reject(error)
            })
            .pipe(fs.createWriteStream(path))
            .on('error', error => reject(error))
            .on('finish', () => resolve( path ))
    );
    return {name:filename,path:res};
};

exports.makeJSONFile = function(data,user,subDir,filename){
    var path = check_make_dir(user,subDir)+filename;
    fs.writeFileSync(path, JSON.stringify(data));
};

exports.moveResources = async function(resources,user,packageName){
    var promise = new Promise(function(resolve, reject) {
        var newPath = null;
        for(var i=0;i<resources.length;i++) {
            newPath = check_make_dir(user,packageName)+resources[i].name;
            fs.rename(resources[i].path, newPath, function (err,d) {
                if(err instanceof Error){
                    reject(err);
                } else {
                    resources[i].path = newPath;
                }
            }(i));
        }
        resolve(resources);
    });
    return promise;
};