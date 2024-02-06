
import { NextFunction, Request,Response } from "express-serve-static-core";
import jwt, { JwtPayload } from  'jsonwebtoken';


//add the user ID to the request
declare global 
{
  namespace Express
  {
    interface Request
    {
      userID: string;
    }
  }
}

//token/user verifier function
//checks if the token is valid or not
const verifyToken =(req: Request,res: Response, next: NextFunction )=>
{
  //get the token
  const token = req.cookies["auth_token"];

  //check if token exists or not
  if(!token)
  {
    //if token is empty/not found, not authorized
    return res.status(401).send({ message: 'Not authorized.'});
  }

  try
  {
    //verify the token using jsonwebtoken library
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.userID = (decoded as JwtPayload).userID;
    next();
  }
  catch(error)
  {
    return res.status(401).send({ message: 'Not authorized.'});
  }

};

export  default verifyToken;