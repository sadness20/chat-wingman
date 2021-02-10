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
let ChatResolver = class ChatResolver {
    constructor() {
        this.conversations = [];
    }
    allMessages(conversation) {
        return this.conversations.filter(c => c.conversation == conversation);
    }
    async sendMessage(pubSub, message, conversation, from, usuario) {
        const payload = { _id: Math.random().toString(), conversation, message, date: moment_1.default().unix(), from, usuario };
        this.conversations.push(payload);
        console.log(payload);
        await pubSub.publish("NEWMESSAGE", payload);
        return true;
    }
    subscriptionMessage(conversation) {
        return this.conversations.filter(c => c.conversation == conversation);
    }
};
__decorate([
    type_graphql_1.Query(returns => [messages_type_1.Message]),
    __param(0, type_graphql_1.Arg("conversation", { nullable: false })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
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
    __metadata("design:returntype", void 0)
], ChatResolver.prototype, "subscriptionMessage", null);
ChatResolver = __decorate([
    type_graphql_1.Resolver()
], ChatResolver);
exports.ChatResolver = ChatResolver;
