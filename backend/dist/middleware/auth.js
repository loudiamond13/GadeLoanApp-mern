"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isEmployee = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../utilities/constants");
//token/user verifier function
//checks if the token is valid or not
const verifyToken = (req, res, next) => {
    //get the token
    const token = req.cookies["auth_token"];
    //check if token exists or not
    if (!token) {
        //if token is empty/not found, not authorized
        return res.status(401).send({ message: 'Not authorized.' });
    }
    try {
        //verify the token using jsonwebtoken library
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userID;
        req.userRole = decoded.userRole;
        req.userFname = decoded.userFname;
        req.userLname = decoded.userLname;
        next();
    }
    catch (error) {
        return res.status(401).send({ message: 'Not authorized.' });
    }
};
const isEmployee = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.userRole === constants_1.UserRole.EMPLOYEE || req.userRole === constants_1.UserRole.ADMIN) {
            next();
        }
        else {
            console.log('Access denied');
            return res.status(403).send({ message: 'You are not authorized!' });
        }
    });
};
exports.isEmployee = isEmployee;
const isAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.userRole !== constants_1.UserRole.ADMIN) {
            console.log('Access denied');
            return res.status(403).send({ message: 'You are not authorized!' });
        }
        else {
            next();
        }
    });
};
exports.isAdmin = isAdmin;
exports.default = verifyToken;
