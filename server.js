import { GraphQLServer } from 'graphql-yoga';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
const compression = require('compression')
import jwt from 'express-jwt';
import path from 'path';
import {fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas';
const typesArray = fileLoader(path.join(__dirname, './schema'));
const resolversArray = fileLoader(path.join(__dirname, './resolvers'));
const fileUpload = require('express-fileupload');
import {authorization} from './directives/authorization';
import { graphqlUploadExpress } from 'graphql-upload';
import cors from 'cors';
import fs from 'fs';
require('dotenv').config()

// for future connection with the engine for api statistics
const ENGINE_API_KEY = 'service:spaceline13-2311:83-z3hTB_OYOhkVXCWiNmA';

//schema
const typeDefs = mergeTypes(typesArray, { all: true });
const resolvers = mergeResolvers(resolversArray);
const directiveResolvers = authorization;

// yoga server
const server = new GraphQLServer({
    typeDefs,
    resolvers,
    directiveResolvers,
    context: req => {
        const {user} = req.request;
        return {user};
    }
});

// auth
const auth = jwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false
});
server.express.post(server.options.endpoint, auth);
server.express.use(compression());
server.express.use(cors());

//fileupload
server.express.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
server.express.use(fileUpload());
server.express.post('/upload', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

	for (var file in req.files) {
		console.log(req.files[file]);
		req.files[file].mv('./data/'+file, function(err) {
			if (err)
				return res.status(500).send(err);

			res.set('Content-Type', 'text/html');
			res.status(200).send();
		});
	}
});
server.express.post('/uploadDataset', function(req, res) {
	var userdir = './data/'+req.body.username;
	var filedir = '/'+req.body.name;
	
	if (!fs.existsSync(userdir)){
		fs.mkdirSync(userdir);
	}
	if(!fs.existsSync(userdir+filedir)){
		fs.mkdirSync(userdir+filedir);
	}
	
	for (var file in req.files) {
		req.files[file].mv(userdir+filedir+"/"+file, function(err) {
			if (err)
				return res.status(500).send(err);
			res.set('Content-Type', 'text/html');
			res.status(200).send();
		});
	}
	var data = {};
	for (var field in req.body){
		data[field] = ( req.body[field].startsWith("{")&&req.body[field].endsWith("}")||req.body[field].startsWith("[")&&req.body[field].endsWith("]") )?JSON.parse(req.body[field]):req.body[field];
	}
	console.log(req.body,'t',data);
	fs.writeFileSync(userdir+filedir+"/"+'datapackage.json', JSON.stringify(data));
});

// start server
server.start({
    tracing: true,
    cacheControl: true,
    port:  2000
}, () => console.log('GraphQL Server Server is running on localhost:6000'))