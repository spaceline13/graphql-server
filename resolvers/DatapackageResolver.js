var fs = require('fs');
import { GraphQLUpload } from 'graphql-upload';
import {fileUpload,makeJSONFile,moveResources} from '../lib/fileHelper';
import mv from 'mv';
import mkdirp from 'mkdirp';
export default {
    Query: {
        async getAllDatapackages(_,args,{user}){
            var path = './data/timos/';
            var datapackages = [];
            /*var items = fs.readdirSync(path);
            items.forEach(item=>{
                var files = fs.readdirSync(path+'/'+item);
                files.forEach(file=>{
                    if(file=='datapackage.json'){
                        var content = fs.readFileSync(path+"/"+item+"/"+file);
                        datapackages.push(JSON.parse(content));
                    }
                })
            });*/
            return datapackages;
        },
        getMyDatapackages(_,args,{user}){
            var path = './data/'+user.username;
            var datapackages = [];
            var items = fs.readdirSync(path);
            items.forEach(item=>{
                console.log(item);
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
            var datapackage = null;
            /*var path = './data/timos';
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
            });*/
            return datapackage;
        }
    },
    Upload: GraphQLUpload,
    Mutation:{
        uploadDataset(_,args,{user}){
            var file = args.file;
            return fileUpload(file,user.username,'tmp');
        },
        uploadDatapackage(_,args,{user}){
            var data = {};
            if(!args.datapackage.name){
                return false;
            }
            for (var field in args.datapackage){
                data[field] = args.datapackage[field].isArray?JSON.parse(args.datapackage[field]):args.datapackage[field];
            }
			var promise = moveResources(data.resources,user.username,data.name);
            promise.then(function(value){
                data.resources = value;
                makeJSONFile(data,user.username,data.name,'datapackage.json');
                console.log(data.resources,'letssee');
            });
            return true;
        }
    }
};