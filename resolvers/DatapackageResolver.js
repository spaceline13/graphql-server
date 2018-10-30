var fs = require('fs');
import { GraphQLUpload } from 'graphql-upload';
import {fileUpload,makeJSONFile,moveResources} from '../lib/fileHelper';
import {generateXML} from '../lib/dataHelper';
import rimraf from 'rimraf';

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
                //console.log(item);
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
        async uploadResource(_,args,{user}){
            var res = [];
            var files = args.file;
            for(var i=0;i<files.length;i++){
                res[i] = await fileUpload(files[i],user.username,'tmp') ;
            }
            return res;
        },
        async uploadDatapackage(_,args,{user}){
            var data = {};
            if(!args.datapackage.name){
                return false;
            }
            for (var field in args.datapackage){
                data[field] = args.datapackage[field].isArray?JSON.parse(args.datapackage[field]):args.datapackage[field];
            }

			/*var promise = moveResources(data.resources,user.username,data.name);
            promise.then(function(value){
                data.resources = value;
                makeJSONFile(data,user.username,data.name,'datapackage.json');
                //console.log(data.resources,'letssee');
            });*/
			var resources = await moveResources(data.resources,user.username,data.name);
            data.resources = resources;
            makeJSONFile(data,user.username,data.name,'datapackage.json');
            var XML = generateXML(data);
            return XML;
        },
        setDoi(_,args,{user}){
            var res = false;
            var path = './data/'+user.username;
            var myPackage = null;
            var items = fs.readdirSync(path);
            items.forEach(item=>{
                if(item==args.name){
                    var files = fs.readdirSync(path+'/'+item);
                    files.forEach(file=>{
                        if(file=='datapackage.json'){
                            var content = fs.readFileSync(path+"/"+item+"/"+file);
                            myPackage = JSON.parse(content);
                            myPackage.doi = args.doi;
                            fs.writeFileSync(path+"/"+item+"/"+file, JSON.stringify(myPackage));
                            res = true;
                        }
                    })
                }
            });
            return res;
        },
        deleteDatapackage(_,args,{user}){
            console.log('del',args);
            var res = false;
            var path = './data/'+user.username;
            var myPackage = null;
            var items = fs.readdirSync(path);
            items.forEach(item=>{
                if(item==args.name){
                    res = rimraf.sync(path+'/'+item);
                }
            });
            console.log(res);
            return res;
        },
    }
};