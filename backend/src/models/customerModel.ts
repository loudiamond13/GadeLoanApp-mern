import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

export type CustomerType = 
{
  _id: string;
  firstName: string;
  lastName: string;
  email:string;
  password?: string;
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  state: string;
  postalCode: string;
  dob: Date;
  age: number;
  phoneNumber: string;
  gender: string;
  imageUrl: string[];
  lastUpdated: Date;
  createdAt: Date;
};


//schema
const customerSchema = new mongoose.Schema<CustomerType>
({
  firstName:{type:String ,required:true },
  lastName:{type:String, required:true},
  email: {type:String, required:true, unique:true},
  streetAddress1: {type:String, required:true},
  streetAddress2: {type:String},
  city: {type:String, required:true},
  state: {type:String, required:true},
  postalCode: {type:String, required:true},
  dob: {type:Date, required:true},
  phoneNumber: {type:String, required:true},
  gender: {type:String, required:true},
  
  imageUrl: [{type:String}],
  lastUpdated: {type:Date},
  createdAt:{type: Date}
});

// //encrypt the user password if changed/new password
// customerSchema.pre('save', async function(next) 
// {
//   if(this.isModified('password')){
//   this.password = await bcrypt.hash(this.password, 8)
//   }
//   next();
// });


const Customer = mongoose.model<CustomerType>("Customer", customerSchema);
export default Customer;

