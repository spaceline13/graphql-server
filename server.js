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
import graphqlCMS from 'graphql-auto-generating-cms/lib/middleware';
require('dotenv').config()

const ENGINE_API_KEY = 'service:spaceline13-2311:83-z3hTB_OYOhkVXCWiNmA'; // TODO

const auth = jwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false
});

const typeDefs = schema;
const resolvers = mergeResolvers([userResolvers,postResolvers,testApiResolvers]);
const directiveResolvers = authorization;


// yoga
const server = new GraphQLServer({
    typeDefs,
    resolvers,
    directiveResolvers,
    context: req => {
        const {user} = req.request;
        return {user};
    }
});
/*let config = {
    schema: printSchema(schema),
}*/
server.express.post(server.options.endpoint, auth);
server.express.use(compression());
//server.express.use('/graphql_cms_endpoint', graphqlCMS(config));
server.start({
    tracing: true,
    cacheControl: true,
    port:  4000
}, () => console.log('GraphQL Server Server is running on localhost:4000'))