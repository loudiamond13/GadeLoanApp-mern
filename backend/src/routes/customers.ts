//installed multer, cloudinary

import jwt from 'jsonwebtoken';
import express,{Request, Response} from "express";
import multer from 'multer';
import cloudinary from 'cloudinary';
import Customer, { CustomerType } from "../models/customerModel";
import verifyToken, { isAdmin, isEmployee } from "../middleware/auth";
import { body, check, validationResult } from "express-validator";
import User, { UserType } from "../models/userModel";
import sendEmail from "../utilities/sendEmail";
import Token from '../models/tokenModel';
import crypto from 'crypto';



const router  = express.Router();

//handles the images
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage, 
  limits:{
    fileSize: 5 * 1024 * 1024 // 5mb
  }
});


router.post(`/register`,
[
  //validator
  check('firstName').notEmpty().withMessage("First name is required."),
  check('lastName').notEmpty().withMessage("Last name is required."),
  check('email').notEmpty().isEmail().withMessage("Email is required."),
  check('password','Password must be at least 6 characters long and contain a number').isLength({min:6}),
  check('streetAddress1').notEmpty().withMessage("Street address is required."),
  check('city').notEmpty().withMessage("City is required."),
  check('state').notEmpty().withMessage("State is required."),
  check('postalCode').notEmpty().withMessage("Postal Code is required."),
  check('dob').notEmpty().isDate().withMessage("Date of Birth is required."),
  check('phoneNumber').notEmpty().withMessage("Phone Number is required."),
  check('gender').notEmpty().withMessage("Gender is required."),
] ,upload.array('imageFile', 1) ,async(req: Request, res: Response) =>  
{

  // Check for validation errors
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try
  {
    const imageFile = req.files as Express.Multer.File[];
    //customer type
    const newCustomer: CustomerType  = req.body;

    // upload the image to cloudinary
    const imageURL = await uploadImages(imageFile);

    //fill the new customer
    newCustomer.imageUrl = imageURL; //if upload was successful. add the URL to the new customer
    newCustomer.createdAt = new Date();

    //create a new documet for customer
    const customer = new  Customer(newCustomer);

    //check if email is already registered in users
    const user = await User.findOne({email:  newCustomer.email });
    
    if (user){
      return res.status(400).json({message: 'Email is already in used.'});
    }

    //create a user account for the new customer
    //create a user with the same id of  the customer
    const newUser = new User({
      _id: customer._id,  //use  the same id as the customer has
      email: newCustomer.email.toLowerCase(),
      firstName: newCustomer.firstName.toUpperCase(), 
      lastName: newCustomer.lastName.toUpperCase(), 
      role: 'customer',
      password: newCustomer.password
    });
    
    
    await newUser.save();
    await  customer.save();

   //generate token for verification of account
   const emailToken = await new Token({user_id: newUser._id , emailToken : crypto.randomBytes(32).toString("hex")}).save();
   const url = `${process.env.FRONTEND_URL || process.env.WEB}/users/${newUser._id}/verify/${emailToken.emailToken}`;
   //send an email for verification
   await sendEmail(newUser.email, 'Verify Email', 
       `<p>Hello ${newUser.firstName},</p>
       <br/>
       <p>Click <a href='${url}'>here</a> to verify your email. If you didn't make this request just ignore this email.</p>
       </br>
       <p>Thank you,</p>
       <p>Gade Loan App</p>`); 

    //if userRole is undefined/"", it means no one  is logged in so we will not set a token
    if(!req.userRole)
    {
      //process a token that expires in 1day
      //send the user role,firstname,lastname,userId to the middleware
      const token = jwt.sign({
            userID: newUser._id, 
            userRole: newUser.role, 
            userFname: newUser.firstName, 
            userLname: newUser.lastName
          },
          process.env.JWT_SECRET_KEY as string, {expiresIn: '1d'});

      //set the cookie
      res.cookie(`auth_token`, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400000});
    }

    //return a 200/success status
    return res.status(200).send({message:`Customer ${newUser.email} has been successfully registered.` });
  }
  catch(error)
  {
    console.log(`Error creating new Customer`, error);
    res.status(500).json({message: `Something went wrong`});
  }

});



//get one customer by ID
router.get(`/:id`, verifyToken, async(req:Request, res: Response)=> 
{
  try
  {
    //get the customer, do not include password
    const customer = await Customer.findOne({_id: req.params.id});

    //if no customer is found, send error message
    if(!customer)
    {
      return res.status(404).json({ message : "No customer with this id"});
    }
    else
    {
      //if customer is found, return the customer
      return res.json(customer);
    }

    
  }
  catch(error)
  {
    return res.status(400).json({ message : "ID not found"});
  }
});


//get all customer
router.get('/', isEmployee, async (req: Request, res: Response) => { 
  try {
      // get search term, page number, limit, and branch filter from query parameters
      let { search, pageNum } = req.query; 
      const query: any = {}; // an empty query object

      // if search term is provided, add search conditions to the query
      if (search) 
      {
        query.$or = [
            { firstName: { $regex: new RegExp(search as string, 'i')}}, // case-insensitive search by first name
            { lastName: { $regex: new RegExp(search as string, 'i')}},  // case-insensitive search by last name
            { email:  {$regex: new RegExp(search as string, 'i')}} //and email
        ];
      }


      const pageSize = 5;
      const page = pageNum ? parseInt(pageNum.toString()) : 1; // set the default page number to page 1

      // perform pagination using skip and limit
      const skip = (page - 1) * pageSize; // calculate the number of documents to skip
      const totalCount = await Customer.countDocuments(query); // Get the total count of documents that match the query
      const customers = await Customer.find(query)
          .sort({ firstName: 1 }) // Sort by firstName in default
          .skip(skip) // Skip documents
          .limit(pageSize); // Limit the number of documents per page

      // Return the paginated customers and metadata
      return res.json({
              totalCount,
              totalPages: Math.ceil(totalCount / pageSize), // Calculate the total number of pages
              currentPage: page,
              customers,
            });

  } catch (error) {
      return res.status(500).json({ message: 'Failed to load customers.' });
  }
});


//updating customer
router.put(`/:customer_id`, verifyToken, upload.array('imageFile',1), async(req:Request,res:Response)=>
{
  try
  {
    const updatedCustomer: CustomerType = req.body;
    updatedCustomer.lastUpdated = new Date();
    console.log(req.params.customer_id);

    //find and update the customer
    const customer = await Customer.findOneAndUpdate({_id: req.params.customer_id}, updatedCustomer, {new:true});

    if(!customer)
    {
      return  res.status(404).json({message:`No Customer Found!`});
    }

    //find the customers user acc
    const userCustomer = await User.findById({_id: customer._id});
    if(!userCustomer)
    {
      return res.status(404).json({message: 'Customer user account  not found!'});
    }
    else
    {
      //update the first  name and last name of the customer user  account
      userCustomer.firstName = customer.firstName;
      userCustomer.lastName = customer.lastName;
      userCustomer.save();
    }


    const imageFile = req.files as Express.Multer.File[];

    //upload images
    const updatedImageURL = await uploadImages(imageFile);
    
    console.log(updatedCustomer.imageUrl);
    console.log(updatedImageURL.length);

    if(updatedImageURL.length === 0)
    {
      customer.imageUrl =  customer.imageUrl;
    }
    else
    {
      customer.imageUrl = updatedImageURL;
    }

    customer.lastUpdated = new Date();

    await customer.save();

    res.status(201).json(customer)
  }
  catch(error)
  {
    res.status(500).json({message:"Internal Server Error."})
  }
});



async function uploadImages(imageFile: Express.Multer.File[]) {
 
  //process the image asyncronos
  const uploadPromises = imageFile.map(async (image) => {
    //convert the image to base64 string 
    const b64 = Buffer.from(image.buffer).toString('base64');
    //creates the string that describes the image png/jpg etc..
    let dataURI = 'data:' + image.mimetype + ';base64,' + b64;
    //response
    //uploader
    const res = await cloudinary.v2.uploader.upload(dataURI);

    //get the url of the hosted image that  was uploaded on cloudinary from res
    return res.url;
  });
  //wait for the images to be uploaded
  const imageURL = await Promise.all(uploadPromises);
  return imageURL;
}


export  {router as   createCustomerRouter};