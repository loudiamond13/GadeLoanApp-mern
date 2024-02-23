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
exports.UserRoutes = void 0;
const express_validator_1 = require("express-validator");
const express_1 = __importDefault(require("express"));
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = __importDefault(require("../middleware/auth"));
const tokenModel_1 = __importDefault(require("../models/tokenModel"));
const sendEmail_1 = __importDefault(require("../utilities/sendEmail"));
const crypto_1 = __importDefault(require("crypto"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
exports.UserRoutes = router;
// /api/users/register/
router.post(`/register`, [
    // user input validator
    (0, express_validator_1.check)('firstName', 'First Name is  required').isString(),
    (0, express_validator_1.check)('lastName', 'Last Name is required').isString(),
    (0, express_validator_1.check)('email', 'Email is not valid').isEmail(),
    (0, express_validator_1.check)('password', 'Password must be at least 6 characters long and contain a number').isLength({ min: 6 })
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get the errors if there is any
    const errors = (0, express_validator_1.validationResult)(req);
    //if errors is not empty then store the errors into json array
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    try {
        //find if the user email exists
        let user = yield userModel_1.default.findOne({ email: req.body.email });
        //if user email exists
        if (user) {
            console.log(`Email ${user.email} already Exist.`);
            return res.status(400).json({ message: `Email already exists.` });
        }
        //if user don't exist
        //create new user and save it to database
        user = new userModel_1.default(req.body);
        yield user.save();
        //generate token for verification of account
        const emailToken = yield new tokenModel_1.default({ user_id: user._id, token: crypto_1.default.randomBytes(32).toString("hex") }).save();
        const url = `${process.env.FRONTEND_URL || "https://gadeloanappmern.onrender.com"}/users/${user._id}/verify/${emailToken.token}`;
        yield (0, sendEmail_1.default)(user.email, 'Verify Email', url);
        //process the jason web token
        const token = jsonwebtoken_1.default.sign({ userID: user._id, userRole: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' }); //token expiration
        res.cookie(`auth_token`, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000
        });
        return res.status(200).send({ message: `User ${user.email} has been successfully registered. Verify` });
    }
    //if error
    catch (error) {
        console.log('Error in registering a user', error);
        //make the error status message error, it might contain private information 
        res.status(500).send({ message: `Something went wrong.` });
    }
}));
//gets user
router.get(`/:user_id`, auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(req.params.user_id).select("-password");
        if (!user) {
            return res.status(400).json({ message: "No user found." });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error.' });
    }
}));
// Update user profile
router.put(`/:user_id`, auth_1.default, upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //user updated info from the body
        const updatedUser = req.body;
        //use params for id to look up user from db
        //gets the user
        const user = yield userModel_1.default.findById(req.params.user_id);
        //checks if there is no user with that id
        if (!user) {
            return res.status(400).json({ message: "No user found." });
        }
        else {
            //if email is to be change, check if email exists in the db
            if (updatedUser.confirmNewEmail !== '') {
                //check new email if it exist in db
                const checkEmail = yield userModel_1.default.findOne({ email: updatedUser.confirmNewEmail });
                //if email exist, return message to the user
                if (checkEmail) {
                    return res.status(400).json({ message: `Email already exists/used.` });
                }
                else {
                    //set emailVerified to false and save to update the field
                    user.emailVerified = false;
                    user.email = updatedUser.confirmNewEmail;
                }
            }
            //chek if password has to be changed
            if (updatedUser.confirmNewPassword !== '') {
                //check the passed in current password if correct, if correct, change tha password
                const isMatch = yield bcryptjs_1.default.compare(updatedUser.currentPassword, user.password);
                if (!isMatch) {
                    return res.status(401).json({ message: 'Incorrect Current Password!' });
                }
                else {
                    //else set the confirmNewPassword as the user current password
                    user.password = updatedUser.confirmNewPassword;
                }
            }
            user.firstName = updatedUser.firstName;
            user.lastName = updatedUser.lastName;
            yield user.save();
            return res.status(200).json(user);
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Error Server" });
    }
}));
//email verification and setting user email verified to true
router.post('/:user_id/verify/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //find the token using the passed in token from params
        const token = yield tokenModel_1.default.findOne({ user_id: req.params.user_id, token: req.params.token });
        //check if there is token
        if (!token) {
            return res.status(400).json({ message: 'Invalid Link!' });
        }
        //get the user from db using the passed in id
        const user = yield userModel_1.default.findOne({ _id: req.params.user_id });
        //check if there is user 
        if (!user) {
            return res.status(400).json({ message: "Invalid Link!" });
        }
        user.emailVerified = true; // set verified to true
        yield user.save();
        // Remove the used token from the Token collection
        yield token.deleteOne();
        return res.status(200).json({ message: 'Email has been verified' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error!' });
    }
}));
//resend the email verification
router.post('/resend-verification/:user_id', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //find the user
        const user = yield userModel_1.default.findOne({ _id: req.params.user_id });
        if (!user) {
            return res.status(400).json({ message: 'No User Found' });
        }
        if (!user.emailVerified) {
            let token = yield tokenModel_1.default.findOne({ user_id: req.params.user_id });
            if (!token) {
                token = yield new tokenModel_1.default({ user_id: user._id, token: crypto_1.default.randomBytes(32).toString("hex") }).save();
                const url = `${"https://gadeloanappmern.onrender.com"}/users/${user._id}/verify/${token.token}`;
                yield (0, sendEmail_1.default)(user.email, 'Verify Email', url);
                return res.status(200).json({ message: 'Email Verification Sent!' });
            }
            else {
                token.token = crypto_1.default.randomBytes(32).toString("hex");
                token.save();
                const url = `${process.env.FRONTEND_URL || ""}/users/${user._id}/verify/${token.token}`;
                yield (0, sendEmail_1.default)(user.email, 'Verify Email', url);
                return res.status(200).json({ message: 'Email Verification Sent!' });
            }
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error' });
    }
}));
