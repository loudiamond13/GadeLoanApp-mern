import mongoose from "mongoose";


export type CustomerType = 
{
  _id: string;
  user_id:  string;
  firstName: string;
  lastName: string;
  email:string;
  streetAddress: string;
  barangay: string;
  cityMunicipality: string;
  province: string;
  dob: Date;
  age: number;
  phoneNumber: string;
  sex: string;
  branch: string;
  imageUrl: string[];
  lastUpdated: Date;
  isActive: boolean;
};


//schema
const customerSchema = new mongoose.Schema<CustomerType>
({
  user_id: {type : String, required: true},
  firstName:{type:String ,required:true },
  lastName:{type:String, required:true},
  email: {type:String, unique:true},
  streetAddress: {type:String, required:true},
  barangay: {type:String, required:true},
  cityMunicipality: {type:String, required:true},
  province: {type:String, required:true},
  dob: {type:Date, required:true},
  phoneNumber: {type:String, required:true},
  sex: {type:String, required:true},
  branch: {type:String, required:true},

  imageUrl: [{type:String}],
  lastUpdated: {type:Date, required:true},
  isActive: {type: Boolean, required: true}
});

const Customer = mongoose.model<CustomerType>("Customer", customerSchema);
export default Customer;

