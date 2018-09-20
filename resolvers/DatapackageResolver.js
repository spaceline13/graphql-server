var fs = require('fs');

export default {
    Query: {
        async getAllDatapackages(_,args,{user}){
            var path = './data';
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
            var path = './data';
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
    Mutation:{

    }
};