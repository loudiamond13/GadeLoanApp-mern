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
exports.authenticationRoute = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
exports.authenticationRoute = router;
//login router
router.post('/login', [
    //validation
    (0, express_validator_1.check)('email', 'Email is required').isEmail(),
    (0, express_validator_1.check)('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if there is validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        //if there is error, return the error
        return res.status(400).json({ message: errors.array() });
    }
    //request the email and password
    const { email, password } = req.body;
    try {
        //find the  user by the provided email
        const user = yield userModel_1.default.findOne({ email });
        //if there is no user  with such email - send error message
        if (!user) {
            return res.status(400).json({ message: 'Invalid email/password.' });
        }
        //if email exists in the DB, check password
        //check if the password matches by hashing it using  bcrypt compareSync function
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        // if not matched  - send an error to the client
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email/password.' });
        }
        //create a jwt token for authentication 
        const token = jsonwebtoken_1.default.sign({ userID: user.id, userRole: user.role, userFname: user.firstName, userLname: user.lastName }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
        //return the response with the token as http cookie
        res.cookie(`auth_token`, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000
        });
        res.status(200).json({ userID: user._id });
    }
    catch (error) {
        console.log("Error in login route", error);
        return res.status(500).json({ message: "Server Error" });
    }
}));
//helps the app to identify if user is log in or not
//using the cookie parser helps this
//validate token end-point
router.get('/validate-token', auth_1.default, (req, res) => {
    res.status(200).send({ userID: req.userId, userRole: req.userRole, userFname: req.userFname, userLname: req.userLname });
});
router.post(`/logout`, (req, res) => {
    res.cookie(`auth_token`, "", {
        expires: new Date(0),
    });
    res.send();
});
