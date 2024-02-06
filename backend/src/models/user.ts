import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
//user type
export type UserType = {
  _id:        string;
  email:      string;
  password:   string;
  lastName:   string;
  firstName:  string;
};

//user schema
const userSchema = new mongoose.Schema({
  email:{type: String, required: true, unique: true},
  password: {type: String, required: true },
  lastName: {type: String, required: true},
  firstName: {type: String, required: true}
});

//encrypt the user password if changed/new password
userSchema.pre('save', async function(next) 
{
  if(this.isModified(`password`)){
    this.password = await bcrypt.hash(this.password, 8)
  }
  next();
});

//user model
const  User = mongoose.model<UserType>("User", userSchema);

export default User;