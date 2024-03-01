
import {check, param, validationResult} from 'express-validator';
import express,{Request, Response} from 'express';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import verifyToken, { isAdmin } from '../middleware/auth';
import Token from '../models/tokenModel';
import sendEmail from '../utilities/sendEmail';
import crypto from 'crypto';
import multer from 'multer';
import { json } from 'body-parser';
import { UserRole } from '../utilities/constants';
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
    let user  = await User.findOne({email: req.body.email.toLowerCase()});

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
    const emailToken = await new Token({user_id: user._id , emailToken : crypto.randomBytes(32).toString("hex")}).save();
    const url = `${process.env.FRONTEND_URL || process.env.WEB}/users/${user._id}/verify/${emailToken.emailToken}`;
    await sendEmail(user.email, 'Verify Email', 
        `<p>Hello ${user.firstName},</p>
        <br/>
        <p>Click <a href='${url}'>here</a> to verify your email. If you didn't make this request just ignore this email.</p>
        </br>
        <p>Thank you,</p>
        <p>Gade Loan App</p>`); 
    

    //process the  token
    const token = jwt.sign({userID: user._id, userRole: user.role}, 
      process.env.JWT_SECRET_KEY as string, 
      {expiresIn: '1d'}); //token expiration

    //send/set cookie
    res.cookie(`auth_token`,  
    token,  {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 86400000});
      
    return res.status(200).send({message: `User ${user.email} has been successfully registered.`});
      
  }
  //if error
  catch(error)
  {
    console.log('Error in registering a user', error);
    //make the error status message error, it might contain private information 
    res.status(500).send({message:`Something went wrong.`});
  }
});

//registering/adding employee 
router.post(`/create-employee`,[
  // user input validator
  check('firstName', 'First Name is  required').isString(),
  check('lastName',  'Last Name is required').isString(),
  check('email',  'Email is not valid').isEmail(),
  check('password','Password must be at least 6 characters long and contain a number').isLength({min:6})
],isAdmin, async (req:Request, res: Response) => {
  
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
    let user  = await User.findOne({email: req.body.email.toLowerCase()});

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
    const emailToken = await new Token({user_id: user._id , emailToken : crypto.randomBytes(32).toString("hex")}).save();
    const url = `${process.env.FRONTEND_URL || process.env.WEB}/users/${user._id}/verify/${emailToken.emailToken}`;
    await sendEmail(user.email, 'Verify Email', 
        `<p>Hello ${user.firstName},</p>
        <br/>
        <p>Click <a href='${url}'>here</a> to verify your email. If you didn't make this request just ignore this email.</p>
        </br>
        <p>Thank you,</p>
        <p>Gade Loan App</p>`); 

    return res.status(200).send({message: `Employee ${user.email} has been successfully registered.`});
  
  }
  //if error
  catch(error)
  {
    console.log('Error in registering a user', error);
    //make the error status message error, it might contain private information 
    res.status(500).send({message:`Something went wrong.`});
  }
});

//deletes a user
router.delete(`/:id`, isAdmin, async(req: Request, res: Response)=>
{
  //emplyee id
  const  employee_id= req.params.id;

  try 
  {
    const toBeDeletedEmployee = await User.findOne({_id: employee_id, role:UserRole.EMPLOYEE});

    //check if  there are any records returned by this query
    if(!toBeDeletedEmployee)
    {
      return res.status(400).json({message:'Employee not found'});
    }

   await toBeDeletedEmployee.deleteOne(); // delete employee

    // Send a success response
    res.status(200).json({ message: 'Employee deleted successfully' });
  } 
  catch (error) 
  {
    console.log(error);
    return res.status(500).json({message:'Server Error'});
  }

});


// Route to lock or unlock an employee by ID
router.put('/lock-unlock/:id', async (req, res) => {
  const employeeId = req.params.id;
  const action = req.body.action; //  action is specified in the request body

  try {
    // Find the employee by ID
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Perform action based on the request body
    if (action === 'lock') 
    {
      employee.isLocked = true;
      await employee.save();
      res.json({ message: 'Employee locked successfully' });
    } 
    else if (action === 'unlock') 
    {
      employee.isLocked = false;
      await employee.save();
      res.json({ message: 'Employee unlocked successfully' });
    } 
    else 
    {
      res.status(400).json({ message: 'Invalid action' });
    }
    
  } catch (error) {
    console.error('Error locking/unlocking employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

    

//get all employee user
router.get(`/employees`, isAdmin, async(req: Request, res: Response) => 
{
  const employee = await User.find({role: 'employee'});
  //check if there is employee found
  if(!employee)
  {
    return res.status(404).json({message:'No employees found.'});
  }

  return res.status(200).json(employee);
});



//gets user by id
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
    const token = await Token.findOne({user_id: req.params.user_id, emailToken: req.params.token});

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
      let token = await Token.findOne({user_id: user._id});

      //check if user has already a email token for verification
      if(!token)
      {
        token = await new Token({user_id: user._id ,emailToken : crypto.randomBytes(32).toString("hex")}).save();
        const url = `${process.env.FRONTEND_URL || process.env.WEB}/users/${user._id}/verify/${token.emailToken}`;
        await sendEmail(user.email, 'Verify Email', 
        `<p>Hello ${user.firstName},</p>
        <br/>
        <p>Click <a href='${url}'>here</a> to verify your email. If you didn't make this request just ignore this email.</p>
        </br>
        <p>Thank you,</p>
        <p>Gade Loan App</p>`);

        return res.status(200).json({message: 'Email Verification Sent!'});
      }
      //if user has email token for email verification, make a new one and resend email verification link
      else
      {
        token.emailToken=crypto.randomBytes(32).toString("hex");
        token.save();
        const url = `${process.env.FRONTEND_URL || process.env.WEB}/users/${user._id}/verify/${token.emailToken}`;
        await sendEmail(user.email, 'Verify Email', 
        `<p>Hello ${user.firstName},</p>
        <br/>
        <p>Click <a href='${url}'>here</a> to verify your email. If you didn't make this request just ignore this email.</p>
        </br>
        <p>Thank you,</p>
        <p>Gade Loan App</p>`);

        return res.status(200).json({message: 'Email Verification Sent!'});
      }
    }
 
    
    
  } 
  catch (error) {
    console.log(error)
    return res.status(500).json({message:'Server Error'});
  }
});


//send link for forgot password
router.post('/forgot-password/',
check('email', "Email is Required").isEmail()
,upload.none() ,async (req:Request,res:Response) =>
{
  try {

    const {email} = req.body; 

    //find user in the user db using user email
    const user = await User.findOne({email: email});

    //check if user exists
    if(!user) 
    {
      return res.status(404).json({messsage: 'Email do not exist!'});
    }
    else // if user exists
    {
      let token = await Token.findOne({user_id: user._id});

      //check if user already has a token, if not create token
      if(!token)
      {
        //create new token and save it to the database with expiration time of 1 hour
        token = await new Token({user_id: user._id, passwordToken:crypto.randomBytes(32).toString("hex")}).save();
        //forgot pw url
        const url = `${process.env.FRONTEND_URL || process.env.WEB}/forgot-password/${user._id}/verify/${token.passwordToken}`;
        await sendEmail(user.email, 'Reset Password', 
        `<p>Hello ${user.firstName},</p>
        <br/>
        <p>Click <a href='${url}'>here</a> to reset your password. If you didn't make this request, please change your password ASAP.</p>
        </br>
        <p>Thank you,</p>
        <p>Gade Loan App</p>`);

        return res.status(200).json({message: 'Check your email to reset password!'});
      }
      else
      {
        token.passwordToken=crypto.randomBytes(32).toString("hex");
        token.save();
        const url = `${process.env.FRONTEND_URL || process.env.WEB}/forgot-password/${user._id}/verify/${token.passwordToken}`;
        await sendEmail(user.email, 'Reset Password', 
        `<p>Hello ${user.firstName},</p>
        <br/>
        <p>Click <a href='${url}'>here</a> to reset your password. If you didn't make this request, please change your password ASAP.</p>
        </br>
        <p>Thank you,</p>
        <p>Gade Loan App</p>`);

        return res.status(200).json({message: 'Check your email to reset password!'});
      }
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:'Server Error'});
  }
});

//process forgot password
router.post('/forgot-password/:user_id', upload.none(), async(req:Request, res: Response) =>
{
  try 
  {
    const {user_id, passwordToken, password} = req.body;
    
    //find the token using the passed in token from params
    const token = await Token.findOne({user_id: user_id, passwordToken: passwordToken});

    //check if there is token
    if(!token)
    {
      return res.status(400).json({message: 'Invalid Link/Reset Password Link Expired!'});
    }
    
    //get the user from db using the passed in id
    const user = await User.findOne({_id: req.params.user_id});
    //check if there is user 
    if (!user)
    {
      return res.status(400).json({ message : "Invalid Link/Reset Password Link Expired!" });
    }

    //delete the token
    await token.deleteOne();

    //change the password
    user.password = password;
    user.save();//save the userchanges

    return res.status(200).json({message: 'Password reset successfully.'});
  } 
  catch (error) {
    console.log(error)
    return res.status(500).json({message:'Server Error'});
  }
});



export {router as UserRoutes};