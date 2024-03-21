"use strict";
//installed multer, cloudinary
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
exports.createCustomerRouter = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const customerModel_1 = __importDefault(require("../models/customerModel"));
const auth_1 = __importStar(require("../middleware/auth"));
const express_validator_1 = require("express-validator");
const userModel_1 = __importDefault(require("../models/userModel"));
const sendEmail_1 = __importDefault(require("../utilities/sendEmail"));
const router = express_1.default.Router();
exports.createCustomerRouter = router;
//handles the images
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5mb
    }
});
router.post(`/`, auth_1.isEmployee, [
    //validator
    (0, express_validator_1.body)('firstName').notEmpty().withMessage("First name is required."),
    (0, express_validator_1.body)('lastName').notEmpty().withMessage("Last name is required."),
    (0, express_validator_1.body)('email').notEmpty().isEmail().withMessage("Email is required."),
    (0, express_validator_1.body)('streetAddress').notEmpty().withMessage("Street address is required."),
    (0, express_validator_1.body)('barangay').notEmpty().withMessage("Barangay is required."),
    (0, express_validator_1.body)('cityMunicipality').notEmpty().withMessage("Municipality/City is required."),
    (0, express_validator_1.body)('province').notEmpty().withMessage("Province is required."),
    (0, express_validator_1.body)('dob').notEmpty().isDate().withMessage("Date of Birth is required."),
    (0, express_validator_1.body)('phoneNumber').notEmpty().withMessage("Phone Number is required."),
    (0, express_validator_1.body)('sex').notEmpty().withMessage("Gender is required."),
    (0, express_validator_1.body)('branch').notEmpty().withMessage("Branch is required."),
    (0, express_validator_1.body)('isActive').notEmpty().isBoolean().withMessage("Active/InActive is required."),
], upload.array('imageFile', 1), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageFile = req.files;
        //customer type
        const newCustomer = req.body;
        // upload the image to cloudinary
        const imageURL = yield uploadImages(imageFile);
        //fill the new customer
        newCustomer.imageUrl = imageURL; //if upload was successful. add the URL to the new customer
        newCustomer.lastUpdated = new Date();
        newCustomer.user_id = req.userId; //user that creates the new customer
        //create a new documet for customer
        const customer = new customerModel_1.default(newCustomer);
        //create a user account for the new customer
        //create a user with the same id of  the customer
        const user = new userModel_1.default({
            _id: customer._id,
            email: newCustomer.email.toLowerCase(),
            firstName: newCustomer.firstName.toUpperCase(),
            lastName: newCustomer.lastName.toUpperCase(),
            role: 'customer',
            password: '123456'
        });
        //save the new customer and its user to the DB
        yield user.save();
        yield customer.save();
        // send and email to the new customer containing the initial password
        yield (0, sendEmail_1.default)(user.email, 'Welcome to Gade Loan App', `<p>Hello ${user.firstName},</p>
    <br/>
    <p>Email: ${user.email}</p>
    <p>Password: 123456</p>
    <p>Please change your password immediately.</p>
    </br>
    <p>Thank you,</p>
    <p>Gade Loan App</p>`);
        //return a 200/success status
        res.status(200).send(customer);
    }
    catch (error) {
        console.log(`Error creating new Customer`, error);
        res.status(500).json({ message: `Something went wrong` });
    }
}));
//get one customer by ID
router.get(`/:id`, auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get the customer
        const customer = yield customerModel_1.default.findOne({ _id: req.params.id });
        //if no customer is found, send error message
        if (!customer) {
            return res.status(404).json({ message: "No customer with this id" });
        }
        else {
            //if customer is found, return the customer
            return res.json(customer);
        }
    }
    catch (error) {
        return res.status(400).json({ message: "ID not found" });
    }
}));
//get all customer
router.get('/', auth_1.isEmployee, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get search term, page number, limit, and branch filter from query parameters
        let { search, pageNum, branch } = req.query;
        const query = {}; // an empty query object
        // if search term is provided, add search conditions to the query
        if (search) {
            query.$or = [
                { firstName: { $regex: new RegExp(search, 'i') } }, // case-insensitive search by first name
                { lastName: { $regex: new RegExp(search, 'i') } }, // case-insensitive search by last name
                { email: { $regex: new RegExp(search, 'i') } } //and email
            ];
        }
        // If branch filter is provided, add branch filter to the query
        if (branch && (branch === 'Carmen' || branch === 'Buenavista')) {
            query.branch = branch;
        }
        const pageSize = 5;
        const page = pageNum ? parseInt(pageNum.toString()) : 1; // set the default page number to page 1
        // Perform pagination using skip and limit
        const skip = (page - 1) * pageSize; // Calculate the number of documents to skip
        const totalCount = yield customerModel_1.default.countDocuments(query); // Get the total count of documents that match the query
        const customers = yield customerModel_1.default.find(query)
            .sort({ firstName: 1 }) // Sort by firstName in default
            .skip(skip) // Skip documents
            .limit(pageSize); // Limit the number of documents per page
        // Return the paginated customers and metadata
        res.json({
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize), // Calculate the total number of pages
            currentPage: page,
            customers,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to load customers.' });
    }
}));
//updating customer
router.put(`/:customer_id`, auth_1.isAdmin, upload.array('imageFile', 1), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedCustomer = req.body;
        updatedCustomer.lastUpdated = new Date();
        console.log(req.params.customer_id);
        const customer = yield customerModel_1.default.findOneAndUpdate({ _id: req.params.customer_id }, updatedCustomer, { new: true });
        if (!customer) {
            return res.status(400).json({ message: `No Customer Found!` });
        }
        const imageFile = req.files;
        //upload images
        const updatedImageURL = yield uploadImages(imageFile);
        console.log(updatedCustomer.imageUrl);
        console.log(updatedImageURL.length);
        if (updatedImageURL.length === 0) {
            customer.imageUrl = customer.imageUrl;
        }
        else {
            customer.imageUrl = updatedImageURL;
        }
        yield customer.save();
        res.status(201).json(customer);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error." });
    }
}));
function uploadImages(imageFile) {
    return __awaiter(this, void 0, void 0, function* () {
        //process the image asyncronos
        const uploadPromises = imageFile.map((image) => __awaiter(this, void 0, void 0, function* () {
            //convert the image to base64 string 
            const b64 = Buffer.from(image.buffer).toString('base64');
            //creates the string that describes the image png/jpg etc..
            let dataURI = 'data:' + image.mimetype + ';base64,' + b64;
            //response
            //uploader
            const res = yield cloudinary_1.default.v2.uploader.upload(dataURI);
            //get the url of the hosted image that  was uploaded on cloudinary from res
            return res.url;
        }));
        //wait for the images to be uploaded
        const imageURL = yield Promise.all(uploadPromises);
        return imageURL;
    });
}
