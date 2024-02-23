
import {check, param, validationResult} from 'express-validator';
import express,{Request, Response} from 'express';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import verifyToken from '../middleware/auth';
import Token from '../models/tokenModel';
import sendEmail from '../utilities/sendEmail';
import crypto from 'crypto';
import multer from 'multer';
import { json } from 'body-parser';
const upload = multer();

const router = express.Router();

// /api/users/register/
router.post(`/register`,[
  // user input validator
  check('firstName', 'First Name is  required').isString(),
  check('lastName',  'Last Name is required').isString(),
  check('email',  'Email is not valid').isEmail(),
  check('password','Password must be at least 6 characters long and contain a number').isLength({min:6})
],async (req:Request, res: Response) => {
  
  // get the errors if there is any
  const errors = validationResult(req);
  //if errors is not empty then store the errors into json array
  if (!errors.isEmpty()) 
  {
    return res.status(400).json({message: errors.array()});
  }
  try
  {
    //find if the user email exists
    let user  = await User.findOne({email: req.body.email});

    //if user email exists
    if(user)
    {
      console.log(`Email ${user.email} already Exist.`)
      return res.status(400).json({message:`Email already exists.`});
    }

    //if user don't exist
    //create new user and save it to database
    user = new User(req.body);
    await user.save();

    //generate token for verification of account
    const emailToken = await new Token({user_id: user._id ,token : crypto.randomBytes(32).toString("hex")}).save();
    const url = `${process.env.FRONTEND_URL || process.env.WEB}/users/${user._id}/verify/${emailToken.token}`;
    await sendEmail(user.email, 'Verify Email', url);

    //process the jason web token
    const token = jwt.sign({userID: user._id, userRole: user.role}, 
      process.env.JWT_SECRET_KEY as string, 
      {expiresIn: '1d'}); //token expiration

    res.cookie(`auth_token`,  
    token,  {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 86400000});
      
    return res.status(200).send({message: `User ${user.email} has been successfully registered. Verify`});
      
  }
  //if error
  catch(error)
  {
    console.log('Error in registering a user', error);
    //make the error status message error, it might contain private information 
    res.status(500).send({message:`Something went wrong.`});
  }
});



//gets user
router.get(`/:user_id`, verifyToken,async(req:Request, res:Response) =>
{
  try
  {
    const user = await User.findById(req.params.user_id).select("-password");
    if(!user) 
    {
      return res.status(400).json({message: "No user found."});
    }

    return res.status(200).json(user);
  }
  catch (error)
  {
    res.status(500).json({message: 'Internal Server Error.'});
  }
});

// Update user profile
router.put(`/:user_id`, verifyToken, upload.none() ,async(req:Request, res: Response)=>
{
  try
  {
     //user updated info from the body
     const updatedUser = req.body;

    //use params for id to look up user from db
    //gets the user
    const user = await User.findById(req.params.user_id);
   

    //checks if there is no user with that id
    if (!user)
    {
       return res.status(400).json({message:"No user found."}) ;
    }
    else 
    {
      //if email is to be change, check if email exists in the db
      if(updatedUser.confirmNewEmail !== '')
      {
        //check new email if it exist in db
        const checkEmail = await  User.findOne({email : updatedUser.confirmNewEmail});

        //if email exist, return message to the user
        if(checkEmail)
        {
          return res.status(400).json({message:`Email already exists/used.`});
        }
        else
        {
          //set emailVerified to false and save to update the field
          user.emailVerified=false;
          user.email = updatedUser.confirmNewEmail;
        }
      }

      //chek if password has to be changed
      if(updatedUser.confirmNewPassword !== '')
      {
        //check the passed in current password if correct, if correct, change tha password
        const isMatch = await bcrypt.compare(updatedUser.currentPassword , user.password);
        if(!isMatch)
        {
           return res.status(401).json({message:'Incorrect Current Password!'});
        }
        else  
        {
          //else set the confirmNewPassword as the user current password
          user.password = updatedUser.confirmNewPassword;
        }
      }

      user.firstName = updatedUser.firstName;
      user.lastName=updatedUser.lastName;

      await  user.save();
      return res.status(200).json(user);
    }
  }
  catch(error)
  {
    return res.status(500).json({message:"Internal Error Server"})
  } 
});


//email verification and setting user email verified to true
router.post('/:user_id/verify/:token', async (req:Request,res:Response)=>
{
  try {
    //find the token using the passed in token from params
    const token = await Token.findOne({user_id: req.params.user_id, token: req.params.token});

    //check if there is token
    if(!token)
    {
      return res.status(400).json({message: 'Invalid Link!'});
    }

    //get the user from db using the passed in id
    const user = await User.findOne({_id: req.params.user_id});
    //check if there is user 
    if (!user)
    {
      return res.status(400).json({ message : "Invalid Link!" });
    }

    user.emailVerified = true; // set verified to true
    await  user.save();

    // Remove the used token from the Token collection
    await token.deleteOne();
    return res.status(200).json({message: 'Email has been verified'});
  } 
  catch (error) {
    console.log(error)
    return res.status(500).json({message: 'Internal Server Error!'})
  }
});

//resend the email verification
router.post('/resend-verification/:user_id',verifyToken ,async (req:Request, res:Response)=>
{
  try 
  {
    //find the user
    const user = await User.findOne({_id:  req.params.user_id});
    if(!user)
    {
      return res.status(400).json({message: 'No User Found'});
    }

    if(!user.emailVerified)
    {
      let token = await Token.findOne({user_id: req.params.user_id});
      if(!token)
      {
        token = await new Token({user_id: user._id ,token : crypto.randomBytes(32).toString("hex")}).save();
        const url = `${process.env.FRONTEND_URL || process.env.WEB}/users/${user._id}/verify/${token.token}`;
        await sendEmail(user.email, 'Verify Email', url);
        return res.status(200).json({message: 'Email Verification Sent!'});
      }
      else
      {
        token.token=crypto.randomBytes(32).toString("hex");
        token.save();
        const url = `${process.env.FRONTEND_URL || ""}/users/${user._id}/verify/${token.token}`;
        await sendEmail(user.email, 'Verify Email', url);
        return res.status(200).json({message: 'Email Verification Sent!'});
      }
    }
 
    
    
  } 
  catch (error) {
    console.log(error)
    return res.status(500).json({message:'Server Error'});
  }
});

export {router as UserRoutes};