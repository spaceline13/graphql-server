import xmlBuilder from 'xml';
exports.generateXML = function(data){
    console.log(data);
    var obj = {
        entry:[
            {
                '_attr':{
                    'xmlns' : "http://www.w3.org/2005/Atom",
                    'xmlns:dcterms' : "http://purl.org/dc/terms/",
                },
            },
            {
                'name':'test'
            }
        ]
    };
    var labelFields = ['subjects','license'];
    var prefix = 'dcterms:';
    for (var field in data){
        if(field==='resources'){

        } else if(data[field] instanceof Array){

            for(var subField in data[field]){
                var d;
                if(labelFields.includes(field)){
                    d = data[field][subField].label;
                } else {
                    d = data[field][subField];
                }
                var tmp = {};
                tmp[prefix+field] = d;
                obj.entry.push(tmp);
            }
        } else {
            var tmp = {};
            tmp[prefix+field] = data[field];
            obj.entry.push(tmp);
        }
    }
    var xml = xmlBuilder(obj, true);
    xml = `<?xml version="1.0"?>\n ${xml}`;
    return xml;
}