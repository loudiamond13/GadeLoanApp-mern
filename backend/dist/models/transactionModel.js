"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// export type transactionType = 
// {
//   amount: number;
//   transaction_code: string;
//   date:Date;
// };
const transactionSchema = new mongoose_1.default.Schema({
    customer_id: { type: String, required: true },
    totalLoan: { type: Number, default: 0 },
    totalPayment: { type: Number, default: 0 },
    totalBalance: { type: Number, default: 0 }, // this will be calculated by the server side code
    transactions: [{
            amount: Number,
            transaction_code: String,
            date: Date,
        }]
});
const Transaction = mongoose_1.default.model(`Transaction`, transactionSchema);
exports.default = Transaction;
