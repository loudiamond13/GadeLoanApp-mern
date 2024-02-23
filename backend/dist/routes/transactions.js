"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const transactionModel_1 = __importDefault(require("../models/transactionModel"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
exports.transactionRouter = router;
// get customer transactions
router.get('/:id', auth_1.isEmployee, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id.toString();
    try {
        //find the a transaction using the  given ID and return it to the user if found otherwise make a new transaction for the user
        const customerTransaction = yield transactionModel_1.default.findOne({ customer_id: id });
        //if there is no transaction for the customer make a new one
        if (!customerTransaction) {
            const newCustomerTransaction = new transactionModel_1.default({ customer_id: id });
            yield newCustomerTransaction.save();
            res.json(newCustomerTransaction);
        }
        else {
            //calculate the loan total
            const loanTotal = customerTransaction.transactions.filter((transaction) => transaction.transaction_code === 'Loan')
                .reduce((total, transact) => total + transact.amount, 0);
            //calculate the payment Total
            const paymentTotal = customerTransaction.transactions.filter((transaction) => transaction.transaction_code === 'Pay')
                .reduce((total, transact) => total + transact.amount, 0);
            customerTransaction.totalLoan = loanTotal;
            customerTransaction.totalPayment = paymentTotal;
            customerTransaction.totalBalance = loanTotal - paymentTotal;
            customerTransaction.transactions.sort((newDate, oldDate) => oldDate.date.getTime() - newDate.date.getTime());
            res.status(200).json(customerTransaction);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching the transactions' });
    }
}));
router.put('/:customer_id', upload.none(), auth_1.isEmployee, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedTransaction = req.body;
        const transaction = yield transactionModel_1.default.findOne({ customer_id: req.params.customer_id });
        if (!transaction) {
            return res.status(404).json({ message: 'There is no such transaction.' });
        }
        transaction.transactions.push(updatedTransaction);
        yield transaction.save();
        res.status(201).json(transaction);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
