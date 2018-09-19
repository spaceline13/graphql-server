import { GraphQLServer } from 'graphql-yoga';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
const compression = require('compression')
import jwt from 'express-jwt';
import { mergeResolvers  } from 'merge-graphql-schemas';
import {schema} from './schema.js';
import {resolvers as userResolvers} from './resolvers/UserResolver';
import {resolvers as postResolvers} from './resolvers/PostResolver';
import {resolvers as testApiResolvers} from './resolvers/TestAPIResolver';
import {authorization} from './directives/authorization';

require('dotenv').config()

// for future connection with the engine for api statistics
const ENGINE_API_KEY = 'service:spaceline13-2311:83-z3hTB_OYOhkVXCWiNmA';

//schema
const typeDefs = schema;
const resolvers = mergeResolvers([userResolvers,postResolvers,testApiResolvers]);
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

// start server
server.start({
    tracing: true,
    cacheControl: true,
    port:  4000
}, () => console.log('GraphQL Server Server is running on localhost:4000'))