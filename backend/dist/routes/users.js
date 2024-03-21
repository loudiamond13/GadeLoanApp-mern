"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const auth_1 = __importStar(require("../middleware/auth"));
const tokenModel_1 = __importDefault(require("../models/tokenModel"));
const sendEmail_1 = __importDefault(require("../utilities/sendEmail"));
const crypto_1 = __importDefault(require("crypto"));
const multer_1 = __importDefault(require("multer"));
const constants_1 = require("../utilities/constants");
const customerModel_1 = __importDefault(require("../models/customerModel"));
const loanModel_1 = __importDefault(require("../models/loanModel"));
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
        let user = yield userModel_1.default.findOne({ email: req.body.email.toLowerCase() });
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
        const emailToken = yield new tokenModel_1.default({ user_id: user._id, emailToken: crypto_1.default.randomBytes(32).toString("hex") }).save();
        const url = `${process.env.FRONTEND_URL || process.env.WEB}/users/${user._id}/verify/${emailToken.emailToken}`;
        yield (0, sendEmail_1.default)(user.email, 'Verify Email', `<p>Hello ${user.firstName},</p>
        <br/>
        <p>Click <a href='${url}'>here</a> to verify your email. If you didn't make this request just ignore this email.</p>
        </br>
        <p>Thank you,</p>
        <p>Gade Loan App</p>`);
        //process the  token
        const token = jsonwebtoken_1.default.sign({ userID: user._id, userRole: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' }); //token expiration
        //send/set cookie
        res.cookie(`auth_token`, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000
        });
        return res.status(200).send({ message: `User ${user.email} has been successfully registered.` });
    }
    //if error
    catch (error) {
        console.log('Error in registering a user', error);
        //make the error status message error, it might contain private information 
        res.status(500).send({ message: `Something went wrong.` });
    }
}));
//gets the current user
router.get('/current', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.userId;
    try {
        let user = yield userModel_1.default.findById(user_id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "No user found." });
        }
        return res.json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
}));
//registering/adding employee 
router.post(`/create-employee`, [
    // user input validator
    (0, express_validator_1.check)('firstName', 'First Name is  required').isString(),
    (0, express_validator_1.check)('lastName', 'Last Name is required').isString(),
    (0, express_validator_1.check)('email', 'Email is not valid').isEmail(),
    (0, express_validator_1.check)('password', 'Password must be at least 6 characters long and contain a number').isLength({ min: 6 })
], auth_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get the errors if there is any
    const errors = (0, express_validator_1.validationResult)(req);
    //if errors is not empty then store the errors into json array
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    try {
        //find if the user email exists
        let user = yield userModel_1.default.findOne({ email: req.body.email.toLowerCase() });
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
        const emailToken = yield new tokenModel_1.default({ user_id: user._id, emailToken: crypto_1.default.randomBytes(32).toString("hex") }).save();
        const url = `${process.env.FRONTEND_URL || process.env.WEB}/users/${user._id}/verify/${emailToken.emailToken}`;
        yield (0, sendEmail_1.default)(user.email, 'Verify Email', `<p>Hello ${user.firstName},</p>
        <br/>
        <p>Click <a href='${url}'>here</a> to verify your email. If you didn't make this request just ignore this email.</p>
        </br>
        <p>Thank you,</p>
        <p>Gade Loan App</p>`);
        return res.status(200).send({ message: `Employee ${user.email} has been successfully registered.` });
    }
    //if error
    catch (error) {
        console.log('Error in registering a user', error);
        //make the error status message error, it might contain private information 
        res.status(500).send({ message: `Something went wrong.` });
    }
}));
//deletes a user
router.delete(`/:id`, auth_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //user id
        const user_id = req.params.id;
        const toBeDeletedUser = yield userModel_1.default.findOne({ _id: user_id });
        //check if  there are any records returned by this query
        if (!toBeDeletedUser) {
            return res.status(400).json({ message: 'User not found' });
        }
        //check if the user is customer
        //if user is a customer. delete its customer document as well
        if (toBeDeletedUser.role === constants_1.UserRole.CUSTOMER) {
            // delete the customer
            yield customerModel_1.default.deleteOne({ _id: toBeDeletedUser._id });
            //delete the customers loan as well
            yield loanModel_1.default.deleteOne({ customer: toBeDeletedUser._id });
        }
        yield toBeDeletedUser.deleteOne(); // delete user
        // Send a success response
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server Error' });
    }
}));
// Route to lock or unlock an employee by ID
router.put('/lock-unlock/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const employeeId = req.params.id;
    const action = req.body.action; //  action is specified in the request body
    try {
        // Find the employee by ID
        const employee = yield userModel_1.default.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        // Perform action based on the request body
        if (action === 'lock') {
            employee.isLocked = true;
            yield employee.save();
            res.json({ message: 'Employee locked successfully' });
        }
        else if (action === 'unlock') {
            employee.isLocked = false;
            yield employee.save();
            res.json({ message: 'Employee unlocked successfully' });
        }
        else {
            res.status(400).json({ message: 'Invalid action' });
        }
    }
    catch (error) {
        console.error('Error locking/unlocking employee:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
//get all employee user
router.get(`/employees`, auth_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const employee = yield userModel_1.default.find({ role: 'employee' }).sort({ firstName: -1 }); // sort by firstname a-z
    //check if there is employee found 
    if (!employee) {
        return res.status(404).json({ message: 'No employees found.' });
    }
    return res.status(200).json(employee);
}));
//gets user by id
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
        const token = yield tokenModel_1.default.findOne({ user_id: req.params.user_id, emailToken: req.params.token });
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
            let token = yield tokenModel_1.default.findOne({ user_id: user._id });
            //check if user has already a email token for verification
            if (!token) {
                token = yield new tokenModel_1.default({ user_id: user._id, emailToken: crypto_1.default.randomBytes(32).toString("hex") }).save();
                const url = `${process.env.FRONTEND_URL || process.env.WEB}/users/${user._id}/verify/${token.emailToken}`;
                yield (0, sendEmail_1.default)(user.email, 'Verify Email', `<p>Hello ${user.firstName},</p>
        <br/>
        <p>Click <a href='${url}'>here</a> to verify your email. If you didn't make this request just ignore this email.</p>
        </br>
        <p>Thank you,</p>
        <p>Gade Loan App</p>`);
                return res.status(200).json({ message: 'Email Verification Sent!' });
            }
            //if user has email token for email verification, make a new one and resend email verification link
            else {
                token.emailToken = crypto_1.default.randomBytes(32).toString("hex");
                token.save();
                const url = `${process.env.FRONTEND_URL || process.env.WEB}/users/${user._id}/verify/${token.emailToken}`;
                yield (0, sendEmail_1.default)(user.email, 'Verify Email', `<p>Hello ${user.firstName},</p>
        <br/>
        <p>Click <a href='${url}'>here</a> to verify your email. If you didn't make this request just ignore this email.</p>
        </br>
        <p>Thank you,</p>
        <p>Gade Loan App</p>`);
                return res.status(200).json({ message: 'Email Verification Sent!' });
            }
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error' });
    }
}));
//send link for forgot password
router.post('/forgot-password/', (0, express_validator_1.check)('email', "Email is Required").isEmail(), upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        //find user in the user db using user email
        const user = yield userModel_1.default.findOne({ email: email });
        //check if user exists
        if (!user) {
            return res.status(404).json({ messsage: 'Email do not exist!' });
        }
        else // if user exists
         {
            let token = yield tokenModel_1.default.findOne({ user_id: user._id });
            //check if user already has a token, if not create token
            if (!token) {
                //create new token and save it to the database with expiration time of 1 hour
                token = yield new tokenModel_1.default({ user_id: user._id, passwordToken: crypto_1.default.randomBytes(32).toString("hex") }).save();
                //forgot pw url
                const url = `${process.env.FRONTEND_URL || process.env.WEB}/forgot-password/${user._id}/verify/${token.passwordToken}`;
                yield (0, sendEmail_1.default)(user.email, 'Reset Password', `<p>Hello ${user.firstName},</p>
        <br/>
        <p>Click <a href='${url}'>here</a> to reset your password. If you didn't make this request, please change your password ASAP.</p>
        </br>
        <p>Thank you,</p>
        <p>Gade Loan App</p>`);
                return res.status(200).json({ message: 'Check your email to reset password!' });
            }
            else {
                token.passwordToken = crypto_1.default.randomBytes(32).toString("hex");
                token.save();
                const url = `${process.env.FRONTEND_URL || process.env.WEB}/forgot-password/${user._id}/verify/${token.passwordToken}`;
                yield (0, sendEmail_1.default)(user.email, 'Reset Password', `<p>Hello ${user.firstName},</p>
        <br/>
        <p>Click <a href='${url}'>here</a> to reset your password. If you didn't make this request, please change your password ASAP.</p>
        </br>
        <p>Thank you,</p>
        <p>Gade Loan App</p>`);
                return res.status(200).json({ message: 'Check your email to reset password!' });
            }
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error' });
    }
}));
//process forgot password
router.post('/forgot-password/:user_id', upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, passwordToken, password } = req.body;
        //find the token using the passed in token from params
        const token = yield tokenModel_1.default.findOne({ user_id: user_id, passwordToken: passwordToken });
        //check if there is token
        if (!token) {
            return res.status(400).json({ message: 'Invalid Link/Reset Password Link Expired!' });
        }
        //get the user from db using the passed in id
        const user = yield userModel_1.default.findOne({ _id: req.params.user_id });
        //check if there is user 
        if (!user) {
            return res.status(400).json({ message: "Invalid Link/Reset Password Link Expired!" });
        }
        //delete the token
        yield token.deleteOne();
        //change the password
        user.password = password;
        user.save(); //save the userchanges
        return res.status(200).json({ message: 'Password reset successfully.' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error' });
    }
}));
