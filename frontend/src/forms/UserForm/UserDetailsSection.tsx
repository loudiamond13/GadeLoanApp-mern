import { useFormContext } from "react-hook-form";
import { UserFormData } from "./UserForm";
import { UserType } from "../../../../backend/src/models/userModel";
import { BsCheck2Circle } from "react-icons/bs";
import ResendVerificationBtn from "../../components/ResendEmailVerificationBtn";
import { useAppContext } from "../../contexts/AppContext";
import { UserRole } from "../../../../backend/src/utilities/constants";


type Props =
{
  user?: UserType;
}

const UserDetailsSection =({user}: Props)=>
{
  const {register, watch ,formState:{errors}} = useFormContext<UserFormData>();
  const {userRole, isLoggedIn} = useAppContext();

  return(
    <div className="flex flex-col gap-4">
      <h3 className="text-dark mb-2">Profile Settings</h3>

      {isLoggedIn && userRole !== UserRole.CUSTOMER && 
        <>
        <h5>Name:</h5>
        <div className="row">
          <label className="form-label col-lg-3">First Name: 
            <input className="form-control" type="text"
              {...register('firstName')}/>
          </label> 
          <label className="form-label col-lg-3">Last Name: 
            <input className="form-control" type="text"
              {...register('lastName')}/>
          </label> 
        </div>
        </>
      }
      <h5 className="mt-3">Change Email?</h5>
      <p>
        <span className="fw-medium">Current Email:</span> {`${user?.email} `}
        { user?.emailVerified == false ? 
        (<><ResendVerificationBtn/></>) : (<span className="text-success"><BsCheck2Circle /></span>) 
        }
      </p>
      <p>Leave this fields empty if you don't wish to change your email address.</p>
      <div className="row">
        <label className="form-label col-lg-3">New email: 
              <input className="form-control" type="email"
              {...register('newEmail')}/>
        </label> 
        <label className="form-label col-lg-3">Confirm new email: 
              <input className="form-control" type="email"
              {...register('confirmNewEmail', 
              {validate:(value) => 
              {
                if(watch('newEmail') !== value) 
                {
                  return 'Email do not match!';
                }
              }})}/>
              {errors.confirmNewEmail && (<span className="text-danger">{errors.confirmNewEmail.message}</span>)}
        </label> 
      </div>
      <h5 className="mt-3">Change Password?</h5>
      <label className="form-label col-md-6">Current Password:
        <input type="Password" className="form-control"
        {...register('currentPassword',{
          minLength: {value:6,message:"Should be at least 6 characters."},
        })}/>
        {
          //displays the error message
          errors.currentPassword && 
          (<span className="text-danger">{errors.currentPassword.message}</span>)
        }
      </label>
      <div className="row">
        <label className="form-label col-lg-3">New password:
          <input type="password" className="form-control" 
          {...register("newPassword", 
          {minLength:{
            value:6, message:"Must be at least 6 characters."

          }})} />
          {errors.newPassword && (
              <span className="text-danger">{errors.newPassword.message}</span>
          )}
        </label>
        <label className="form-label col-lg-3">Confirm new password:
          <input type="password" className="form-control" 
          {...register("confirmNewPassword",{
            validate:(value) => {
                if (watch("newPassword") !== value)
              {
                return "Passwords do not match!";
              }
            }
          })}/>
          {errors.confirmNewPassword && (
              <span className="text-danger">{errors.confirmNewPassword.message}</span>
          )}
        </label>
      </div>
      
    </div>
  );
}

export default UserDetailsSection;