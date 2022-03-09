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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const type_graphql_1 = require("type-graphql");
let Message = class Message {
};
__decorate([
    type_graphql_1.Field(type => type_graphql_1.ID),
    __metadata("design:type", String)
], Message.prototype, "_id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Message.prototype, "conversation", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Message.prototype, "message", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Message.prototype, "date", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Message.prototype, "from", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Message.prototype, "usuario", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Message.prototype, "isFile", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Message.prototype, "to", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Message.prototype, "isSys", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Message.prototype, "sysTo", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Message.prototype, "leido", void 0);
Message = __decorate([
    type_graphql_1.ObjectType()
], Message);
exports.Message = Message;
