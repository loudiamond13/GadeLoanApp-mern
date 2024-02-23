"use strict";
//installed multer, cloudinary
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
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
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
        //save the new customer to the DB
        const customer = new customerModel_1.default(newCustomer);
        yield customer.save();
        //return a 201 status
        res.status(200).send(customer);
    }
    catch (error) {
        console.log(`Error creating new Customer`, error);
        res.status(500).json({ message: `Something went wrong` });
    }
}));
//get one customer by ID
router.get(`/:id`, auth_1.isEmployee, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
// get all customer
router.get('/', auth_1.isEmployee, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield customerModel_1.default.find().sort("lastName"); //sort by first Name 
        res.json(customers);
    }
    catch (error) {
        res.status(500).json({ message: `Failed to load customers.` });
    }
}));
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
