//installed multer, cloudinary


import express,{Request, Response} from "express";
import multer from 'multer';
import cloudinary from 'cloudinary';
import Customer, { CustomerType } from "../models/customerModel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";


const router  = express.Router();

//handles the images
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage, 
  limits:{
    fileSize: 5 * 1024 * 1024 // 5mb
  }
});

router.post(`/`,verifyToken,
[
  //validator
  body('firstName').notEmpty().withMessage("First name is required."),
  body('lastName').notEmpty().withMessage("Last name is required."),
  body('email').notEmpty().isEmail().withMessage("Email is required."),
  body('streetAddress').notEmpty().withMessage("Street address is required."),
  body('barangay').notEmpty().withMessage("Barangay is required."),
  body('cityMunicipality').notEmpty().withMessage("Municipality/City is required."),
  body('province').notEmpty().withMessage("Province is required."),
  body('dob').notEmpty().isDate().withMessage("Date of Birth is required."),
  body('phoneNumber').notEmpty().withMessage("Phone Number is required."),
  body('sex').notEmpty().withMessage("Gender is required."),
  body('branch').notEmpty().withMessage("Branch is required."),
  body('isActive').notEmpty().isBoolean().withMessage("Active/InActive is required."),
] ,upload.array('imageFile', 1) ,async(req: Request, res: Response) => 
{
 
  try
  {
    const imageFile = req.files as Express.Multer.File[];
    //customer type
    const newCustomer: CustomerType  = req.body;

    // upload the image to cloudinary
    //process the image asyncronos
    const uploadPromises = imageFile.map(async(image)=> 
    {
      //convert the image to base64 string 
      const b64 = Buffer.from(image.buffer).toString('base64');
      //creates the string that describes the image png/jpg etc..
      let dataURI = 'data:' + image.mimetype + ';base64,'+ b64 ;
      //response
      //uploader
      const res = await cloudinary.v2.uploader.upload(dataURI);
      //get the url of the hosted image that  was uploaded on cloudinary from res
      return res.url;
    });
    //wait for the images to be uploaded
    const imageURL = await Promise.all(uploadPromises);

    //fill the new customer
    newCustomer.imageFile = imageURL; //if upload was successful. add the URL to the new customer
    newCustomer.lastUpdated = new Date();
    newCustomer.user_id = req.userId; //user that creates the new customer

    
    //save the new customer to the DB
    const customer = new  Customer(newCustomer);
    await  customer.save();

    //return a 201 status
    res.status(201).send(customer);
  }
  catch(error)
  {
    console.log(`Error creating new Customer`, error);
    res.status(500).json({message: `Something went wrong`});
  }

});


export  {router as   createCustomerRouter};