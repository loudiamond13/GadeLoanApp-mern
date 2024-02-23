"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//schema
const customerSchema = new mongoose_1.default.Schema({
    user_id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true },
    streetAddress: { type: String, required: true },
    barangay: { type: String, required: true },
    cityMunicipality: { type: String, required: true },
    province: { type: String, required: true },
    dob: { type: Date, required: true },
    phoneNumber: { type: String, required: true },
    sex: { type: String, required: true },
    branch: { type: String, required: true },
    imageUrl: [{ type: String }],
    lastUpdated: { type: Date, required: true },
    isActive: { type: Boolean, required: true }
});
const Customer = mongoose_1.default.model("Customer", customerSchema);
exports.default = Customer;
