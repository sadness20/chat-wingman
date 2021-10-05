"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatResolver = void 0;
const graphql_subscriptions_1 = require("graphql-subscriptions");
const type_graphql_1 = require("type-graphql");
const moment_1 = __importDefault(require("moment"));
const messages_type_1 = require("../types/messages.type");
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
    database: 'wingman_db'
});
function getConversacion(conversation) {
    return new Promise(function (resolve, reject) {
        var query_str = `SELECT * FROM chats WHERE conversation = "${conversation}"`;
        connection.query(query_str, function (err, rows, fields) {
            // Call reject on error states,
            // call resolve with results
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}
let ChatResolver = class ChatResolver {
    constructor() {
        this.conversations = [];
    }
    async allMessages(conversation) {
        var temp = undefined;
        let var_temp;
        await getConversacion(conversation).then(function (rows) {
            var_temp = Object.values(JSON.parse(JSON.stringify(rows)));
        }).catch((err) => setImmediate(() => { throw err; }));
        return var_temp;
    }
    async sendMessage(pubSub, message, conversation, from, usuario) {
        const payload = { _id: Math.random().toString(), conversation, message, date: moment_1.default().unix(), from, usuario };
        this.conversations.push(payload);
        console.log(payload);
        await connection.query('INSERT INTO chats VALUES("", "' + payload._id + '", "' + payload.conversation + '", "' + payload.message + '", ' + payload.date + ', "' + payload.from + '", "' + payload.usuario + '")');
        await pubSub.publish("NEWMESSAGE", payload);
        return true;
    }
    async subscriptionMessage(conversation) {
        var temp = undefined;
        let var_temp;
        await getConversacion(conversation).then(function (rows) {
            var_temp = Object.values(JSON.parse(JSON.stringify(rows)));
        }).catch((err) => setImmediate(() => { throw err; }));
        return var_temp;
    }
};
__decorate([
    type_graphql_1.Query(returns => [messages_type_1.Message]),
    __param(0, type_graphql_1.Arg("conversation", { nullable: false })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatResolver.prototype, "allMessages", null);
__decorate([
    type_graphql_1.Mutation(returns => Boolean),
    __param(0, type_graphql_1.PubSub()),
    __param(1, type_graphql_1.Arg("message")),
    __param(2, type_graphql_1.Arg("conversation")),
    __param(3, type_graphql_1.Arg("from")),
    __param(4, type_graphql_1.Arg("usuario")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [graphql_subscriptions_1.PubSubEngine, String, String,
        String,
        String]),
    __metadata("design:returntype", Promise)
], ChatResolver.prototype, "sendMessage", null);
__decorate([
    type_graphql_1.Subscription(returns => [messages_type_1.Message], {
        topics: "NEWMESSAGE"
    }),
    __param(0, type_graphql_1.Arg("conversation", { nullable: false })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatResolver.prototype, "subscriptionMessage", null);
ChatResolver = __decorate([
    type_graphql_1.Resolver()
], ChatResolver);
exports.ChatResolver = ChatResolver;
