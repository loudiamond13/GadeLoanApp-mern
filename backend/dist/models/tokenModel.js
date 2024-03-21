"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tokenSchema = new mongoose_1.default.Schema({
    user_id: { type: String, required: true },
    emailToken: { type: String },
    passwordToken: { type: String },
    createdAt: { type: Date, default: Date.now(), expires: 86400 } //1d/24hrs
});
const Token = mongoose_1.default.model("Token", tokenSchema);
exports.default = Token;
