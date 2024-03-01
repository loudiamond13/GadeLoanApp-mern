import express,{Request,Response} from 'express';
import { check, validationResult } from 'express-validator';
import User from "../models/userModel";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import  verifyToken  from '../middleware/auth';





const router  = express.Router();


//login router
router.post('/login', 
[
  //validation
  check('email', 'Email is required').isEmail(),
  check('password',  'Password must be at least 6 characters long').isLength({ min: 6 })
], async (req: Request, res: Response) =>
{
  //check if there is validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
  {
    //if there is error, return the error
    return res.status(400).json({message: errors.array()})
  }
 
  //request the email and password
  const {email,password} = req.body;

  try
  {
    //find the  user by the provided email
    const user = await User.findOne({email: email.toLowerCase()});

    //if there is no user  with such email - send error message
    if(!user)
    {
      return res.status(400).json({message: 'Invalid email/password.'});
    }

    //if email exists in the DB, check password
    //check if the password matches by hashing it using  bcrypt compareSync function
    const isMatch = await bcrypt.compare(password,  user.password);
    
    // if not matched  - send an error to the client
    if(!isMatch)
    {
      return res.status(400).json({message: 'Invalid email/password.'});
    }

    //check if user is locked
    if(user.isLocked)
    {
      return res.status(423).json({message:'Your account is locked. Please contact an admin.'});
    }


    //create a jwt token for authentication 
    const token = jwt.sign({userID: user.id, userRole: user.role, userFname: user.firstName, userLname: user.lastName}, 
                    process.env.JWT_SECRET_KEY as string,  {expiresIn: "1d"});

    //return the response with the token as http cookie
    res.cookie(`auth_token`, 
    token,{
    httpOnly : true, 
    secure: process.env.NODE_ENV === "production",
    maxAge: 86400000
    });

    res.status(200).json({userID: user._id});

  }
  catch(error)
  {
    console.log("Error in login route", error);
    return res.status(500).json({ message:"Server Error" });
  }

});


//helps the app to identify if user is log in or not
//using the cookie parser helps this
//validate token end-point
router.get('/validate-token', verifyToken,  (req:Request,res:Response)=>
{
  res.status(200).send({userID: req.userId, userRole: req.userRole, userFname: req.userFname, userLname: req.userLname});
});



router.post(`/logout`, (req: Request, res: Response)=> 
{
  
  res.cookie(`auth_token`,"", {
    expires: new Date(0),
  });
  res.send();
});

export {router as authenticationRoute};

