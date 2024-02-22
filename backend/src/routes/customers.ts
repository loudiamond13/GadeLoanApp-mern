//installed multer, cloudinary


import express,{Request, Response} from "express";
import multer from 'multer';
import cloudinary from 'cloudinary';
import Customer, { CustomerType } from "../models/customerModel";
import verifyToken, { isAdmin, isEmployee } from "../middleware/auth";
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


router.post(`/`,isEmployee,
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
    const imageURL = await uploadImages(imageFile);

    //fill the new customer
    newCustomer.imageUrl = imageURL; //if upload was successful. add the URL to the new customer
    newCustomer.lastUpdated = new Date();
    newCustomer.user_id = req.userId; //user that creates the new customer
  
    
    //save the new customer to the DB
    const customer = new  Customer(newCustomer);
    await  customer.save();

    //return a 201 status
    res.status(200).send(customer);
  }
  catch(error)
  {
    console.log(`Error creating new Customer`, error);
    res.status(500).json({message: `Something went wrong`});
  }

});



//get one customer by ID
router.get(`/:id`, isEmployee, async(req:Request, res: Response)=> 
{
  try
  {
    //get the customer
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



// get all customer
router.get('/', isEmployee, async (req:Request,res:Response) =>
{
 
  try
  {
    const  customers = await Customer.find().sort("lastName");//sort by first Name 
    res.json(customers);
  
  }
  catch(error)
  {
    res.status(500).json({message:`Failed to load customers.`})
  }
});

router.put(`/:customer_id`, isAdmin, upload.array('imageFile',1), async(req:Request,res:Response)=>
{
  try
  {
    const updatedCustomer: CustomerType = req.body;
    updatedCustomer.lastUpdated = new Date();
    console.log(req.params.customer_id);
    const customer = await Customer.findOneAndUpdate({_id: req.params.customer_id}, updatedCustomer, {new:true});

    if(!customer)
    {
      return  res.status(400).json({message:`No Customer Found!`});
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