import { useFormContext } from "react-hook-form"
import { CustomerFormData } from "./CustomerForm";
import { useEffect } from "react";
import { UserRole, formatDateYYYYmmDD } from "../../../../backend/src/utilities/constants";
import { useAppContext } from "../../contexts/AppContext";

const CustomerDetailsSection =()=>
{
  const {isLoggedIn,userRole} = useAppContext();
  const {register,watch, formState:{errors},setValue} = useFormContext<CustomerFormData>();

  const dob = watch('dob');
  
    
  useEffect(() => {
    // If 'dob' is available (when editing), set the value of 'dob' field in the form
    if (dob) {
    setValue('dob', dob); // set the value of 'dob' field in the form
    }
  }, [dob, setValue]);

  return(
    <div>
      <span className="fw-bold text-dark mb-3">
        {!isLoggedIn && <h1 className="fw-bold text-dark">Register</h1>}
        {isLoggedIn && userRole === UserRole.CUSTOMER && <h3 className="fw-bold text-dark">Edit Profile</h3>}
        {isLoggedIn && userRole !== UserRole.CUSTOMER && <h3 className="fw-bold text-dark">Edit Customer</h3>}
      </span>
      <div className="row">
        <label  className="form-label col-md-6">First Name
          <input type="text" className="form-control"
          {...register(`firstName`,{required: `First Name is required.`})}/>
          {
            errors.firstName && (<span className="text-danger">{errors.firstName.message}</span>)
          }
        </label>
        <label  className="form-label col-md-6">Last Name
          <input type="text" className="form-control"
          {...register(`lastName`,{required: `Last Name is required.`})}/>
          {
            errors.lastName && (<span className="text-danger">{errors.lastName.message}</span>)
          }
        </label>
      </div>
      <div className="row">
        <label  className="form-label col-md-6">Phone Number
          <input type="text" className="form-control"
          {...register(`phoneNumber`,{required: `Phone Number is required.`})}/>
          {
            errors.phoneNumber && (<span className="text-danger">{errors.phoneNumber.message}</span>)
          }
        </label>
        {!isLoggedIn  && //hide this if  user is logged in 
          <label  className="form-label col-md-6">Email
            <input type="email" className="form-control"
            {...register(`email`,{required: `Email is required.`})}/>
            {
              errors.email && (<span className="text-danger">{errors.email.message}</span>)
            }
          </label>
        }
      </div>
      {!isLoggedIn && //hide this if  user is logged in
        <div className="row">
          <label className="form-label col-md-6">Password
            <input type="password" className="form-control" 
            {...register("password", {required: `Password is required.`,
            minLength:{
              value:6, message:"Must be at least 6 characters."

            }})} />
            {errors.password && (<span className="text-danger">{errors.password.message}</span>)}
          </label>
          <label className="form-label col-md-6">Confirm Password
            <input type="password" className="form-control" 
            {...register("confirmPassword",{
              validate:(value) => {
                if(!value)
                {
                  return "This field is required."
                }
                else if (watch("password") !== value)
                {
                  return "Passwords do not match!";
                }
              }
            })}/>
            {errors.confirmPassword && (<span className="text-danger">{errors.confirmPassword.message}</span>)}
          </label>
        </div>
      }
      <div className="row">
        <label  className="form-label col-md-6">Date of Birth
          <input type="date" className="form-control" min="1901-01-01"
            max="2006-01-31"  value={`${formatDateYYYYmmDD(new Date(dob))}`}
          {...register(`dob`,{required: `Date of Birth is required.`})}/>
          {
            errors.dob && (<span className="text-danger">{errors.dob.message}</span>)
          }
        </label>

        <label  className="form-label col-md-6">Gender
          <select className="form-select" {...register('gender',{required: 'Please select a Gender.'})}>
            <option value="">---Select Gender---</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
            {
              errors.gender && 
              (<span className="text-danger">{errors.gender.message}</span>)
            }
        </label>
      </div>
      <div className="row">
        <label  className="form-label col-md-6">Street Address
          <input type="text" className="form-control"
          {...register(`streetAddress1`,{required: `Street Address is required.`})}/>
          {
            errors.streetAddress1 && (<span className="text-danger">{errors.streetAddress1.message}</span>)
          }
        </label>
        <label  className="form-label col-md-6">Apartment, suite, unit, etc. (if applicable)
          <input type="text" className="form-control"
          {...register(`streetAddress2`)}/>
        </label>
      </div>
      <div className="row">
        <label  className="form-label col-md-6">City
          <input type="text" className="form-control"
          {...register(`city`,{required: `City is required.`})}/>
          {
            errors.city && (<span className="text-danger">{errors.city.message}</span>)
          }
        </label>
        <label  className="form-label col-md-6">State
        <input type="text" className="form-control"
          {...register(`state`,{required: `Province is required.`})}/>
          {
            errors.state && (<span className="text-danger">{errors.state.message}</span>)
          }
      </label>
      </div>
      <div className="row">
        <label className="form-label col-md-6">Postal Code
          <input type="text" className="form-control" 
            {...register('postalCode', {required: 'Postal Code is required.'})}/>
            {
              errors.postalCode && (<span className="text-danger">{errors.postalCode.message}</span>)
            }
        </label>
      </div>
    </div>
  );
};

export default  CustomerDetailsSection;