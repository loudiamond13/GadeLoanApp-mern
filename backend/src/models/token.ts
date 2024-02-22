import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";

export type TokenType = 
{
  _id: string;
  user_id: string;
  token: string;
  createdAt: Date;
}

const tokenSchema = new mongoose.Schema<TokenType>({
  user_id: {type: String, required: true }, // reference to the User model
  token:{type: String, required: true},
  createdAt: {type: Date,  default: Date.now(), expires: '24h'} //1d
});

const Token = mongoose.model<TokenType>("Token", tokenSchema);

export default Token;