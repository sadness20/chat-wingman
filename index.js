"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require('dotenv').config({ path: __dirname + '/env/general.env' });
const type_graphql_1 = require("type-graphql");
const logger_helper_1 = require("./helpers/logger.helper");
const headers_helper_1 = require("./helpers/headers.helper");
const chat_resolver_1 = require("./resolvers/chat.resolver");
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
var cors = require('cors');
/*
wingman

hL?j(XUua[k.
*/
const configurations = {
    // Note: You may need sudo to run on port 443
    production: { ssl: true, port: 4021, hostname: 'wingman.mx', path: './ssl/' },
    development: { ssl: false, port: 4021, hostname: 'localhost', path: './ssl/' }
};
const corsOptions = {
    origin: '*',
    credentials: false
};
const config = configurations['production'];
const mysql = require('mysql');
/*
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'wingman_db'
});
*/
const connection = mysql.createConnection({
    host: 'wingman-1.cwljun5jhtyy.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'Wingman2021*',
    database: 'wingman_pruebas'
});
connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db: ' + err);
        return;
    }
    const init = async (port = 4021) => {
        const schema = await type_graphql_1.buildSchema({
            resolvers: [
                chat_resolver_1.ChatResolver
            ]
        });
        const apollo = new apollo_server_express_1.ApolloServer({
            schema,
            subscriptions: "/subscriptions",
            introspection: true,
            playground: true,
            cacheControl: {
                defaultMaxAge: 0
            },
            context: async ({ req, res }) => {
                if (res) {
                    res.setTimeout(600000, () => {
                        logger_helper_1.logger.info('Request has timed out.');
                        res.send(408);
                    });
                }
                return await headers_helper_1.getHeaders(req, res);
            }
        });
        const app = express_1.default();
        app.use(cors(corsOptions));
        apollo.applyMiddleware({ app, cors: false });
        var server;
        if (config.ssl) {
            // Assumes certificates are in a .ssl folder off of the package root. Make sure 
            // these files are secured.
            server = https_1.default.createServer({
                key: fs_1.default.readFileSync(config.path + 'server.key'),
                cert: fs_1.default.readFileSync(config.path + 'server.crt')
            }, app);
            apollo.installSubscriptionHandlers(server);
        }
        else {
            server = http_1.default.createServer(app);
        }
        server.listen({ port: config.port }, () => {
            console.log('🚀 Server ready at', `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${apollo.graphqlPath}`);
            console.log('🚀 Suscriptions ready at', `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${apollo.subscriptionsPath}`);
        });
        return server;
    };
    process.setMaxListeners(0);
    init(process.env.PORT_GRAPHQL || 4021);
});
