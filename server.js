import { GraphQLServer } from 'graphql-yoga';
import proxy from 'http-proxy-middleware';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
const compression = require('compression')
import jwt from 'express-jwt';
import path from 'path';
import {fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas';
const typesArray = fileLoader(path.join(__dirname, './schema'));
const resolversArray = fileLoader(path.join(__dirname, './resolvers'));
const fileUpload = require('express-fileupload');
import fs from 'fs';
import {authorization} from './directives/authorization';
import cors from 'cors';
import {uploadForUser} from './lib/fileHelper';
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
server.express.use('/dataverse',proxy({
    pathRewrite: {
        '^/dataverse/': '/'
    },
    target: 'https://demo.dataverse.org',
    secure: false
}));

//fileupload
//server.express.use(fileUpload());
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
/*server.express.post('/download', function(req, res){
    var file = __dirname + '/upload-folder/dramaticpenguin.MOV';
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    console.log(url_parts);
    //res.download(file); // Set disposition and send it.
});*/

// start server
server.start({
    tracing: true,
    cacheControl: true,
    port:  2000
}, () => console.log('GraphQL Server Server is running on localhost:2000'))