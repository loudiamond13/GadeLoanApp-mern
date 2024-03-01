
import mongoose from "mongoose";

export type TokenType = 
{
  _id: string;
  user_id: string;
  emailToken: string;
  passwordToken:string;
  createdAt: Date;
}

const tokenSchema = new mongoose.Schema<TokenType>({
  user_id: {type: String, required: true }, 
  emailToken:{type: String},
  passwordToken: {type:String},
  createdAt: {type: Date,  default: Date.now(), expires: 86400} //1d/24hrs
});

const Token = mongoose.model<TokenType>("Token", tokenSchema);

export default Token;