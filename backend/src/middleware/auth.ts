
import { NextFunction, Request,Response } from "express-serve-static-core";
import jwt, { JwtPayload } from  'jsonwebtoken';
import { UserRole } from "../utilities/constants";


//add the user ID to the request
declare global 
{
  namespace Express
  {
    interface Request
    {
      userId: string;
      userRole:string;
      userFname:string;
      userLname:string;
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
    req.userId = (decoded as JwtPayload).userID;
    req.userRole = (decoded as JwtPayload).userRole;
    req.userFname = (decoded as JwtPayload).userFname;
    req.userLname= (decoded as JwtPayload).userLname;
    next();
  }
  catch(error)
  {
    return res.status(401).send({ message: 'Not authorized.'});
  }

};

export const isEmployee = (req:Request, res:Response,next:NextFunction)=>
{
  
  verifyToken(req, res, () =>
  {
    if(req.userRole === UserRole.EMPLOYEE || req.userRole === UserRole.ADMIN)
    {
      next();
    }
    else
    {
      console.log('Access denied');
      return res.status(403).send({message:'You are not authorized!'});
    }
  });
};

export const isAdmin = (req: Request, res:Response, next: NextFunction) => 
{
  verifyToken(req, res, () =>
  {
    if(req.userRole !== UserRole.ADMIN)
    {
      console.log('Access denied');
      return res.status(403).send({message:'You are not authorized!'});
    }
    else
    {
      next();
    }
  });
}





export  default verifyToken;
