"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require('dotenv').config({ path: __dirname + '/env/general.env' });
const apollo_server_1 = require("apollo-server");
const type_graphql_1 = require("type-graphql");
const logger_helper_1 = require("./helpers/logger.helper");
const headers_helper_1 = require("./helpers/headers.helper");
const chat_resolver_1 = require("./resolvers/chat.resolver");
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'wingman-1.cwljun5jhtyy.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'Wingman2021*',
    database: 'wingman_db'
});
connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    const init = async (port = 4020) => {
        const schema = await type_graphql_1.buildSchema({
            resolvers: [
                chat_resolver_1.ChatResolver
            ]
        });
        const server = new apollo_server_1.ApolloServer({
            schema,
            subscriptions: "/graphql",
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
        const { url } = await server.listen(port);
        logger_helper_1.logger.info(`Server is running on ${url}`);
        return server;
    };
    process.setMaxListeners(0);
    init(process.env.PORT_GRAPHQL || 4020);
});
