
import {check, validationResult} from 'express-validator';
import express,{Request, Response} from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken'
// import debug from 'debug';
// const debugUser = debug(`app:User`);

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

    //process the jason web token
    const token = jwt.sign({userID: user._id}, 
      process.env.JWT_SECRET_KEY as string, 
      {expiresIn: '1d'}); //token expiration

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


export {router as UserRoutes};