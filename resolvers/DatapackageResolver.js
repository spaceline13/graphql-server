var fs = require('fs');
import { GraphQLUpload } from 'graphql-upload';

const storeFS = ({ stream, filename }) => {
    const path = `/data/timos/${filename}`;
    return new Promise((resolve, reject) =>
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
};
const processUpload = async upload => {
    const { stream, filename, mimetype } = await upload;
    console.log(stream,filename);
    const path = await storeFS({ stream, filename });
    console.log(path);
    return path;
};

export default {
    Query: {
        async getAllDatapackages(_,args,{user}){
            var path = './data/timos';
            var datapackages = [];
            var items = fs.readdirSync(path);
            items.forEach(item=>{
                var files = fs.readdirSync(path+'/'+item);
                files.forEach(file=>{
                    if(file=='datapackage.json'){
                        var content = fs.readFileSync(path+"/"+item+"/"+file);
                        datapackages.push(JSON.parse(content));
                    }
                })
            });
            return datapackages;
        },
        getDatapackage(_,args, {user}){
            var name = args.name;
            var path = './data/timos';
            var datapackage = null;
            var items = fs.readdirSync(path);
            items.forEach(item=>{
                var files = fs.readdirSync(path+'/'+item);
                files.forEach(file=>{
                    if(file=='datapackage.json'){
                        var content = fs.readFileSync(path+"/"+item+"/"+file);
                        var json = JSON.parse(content);
                        if(json.name==name){
                            datapackage = json;
                        }
                    }
                })
            });
            return datapackage;
        }
    },
    Upload: GraphQLUpload,
    Mutation:{
        uploadDatapackage(_,args,{user}){
            var file = args.file;
            console.log(args);
            return processUpload(file);
        }
    }
};