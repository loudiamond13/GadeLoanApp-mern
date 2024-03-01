import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";



export type ResetPasswordData = 
{
  password: string;
  confirmPassword: string;
  user_id: string;
}

 type Props = 
 {
   onReset: (resetPasswordData: FormData) => void;
 };


const ManageResetPasswordForm =({onReset}: Props)=>
{
  const {user_id, token } = useParams();

  const formMethods = useForm<ResetPasswordData>();
  const {handleSubmit,watch, register,formState: {errors}} = formMethods;

  const onSubmit = handleSubmit((formDataJson: ResetPasswordData)=>
  {
    const formData = new FormData();

    formData.append('user_id', user_id || '');
    formData.append('passwordToken', token || '');
    formData.append('password', formDataJson.confirmPassword);
    
    // Send data to the server here
    onReset(formData);
  });

  return(
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit}>
        <div className="row">
          <h1>Reset Password</h1>
          <label className="form-label col-md-6">New Password
            <input type="password" className="form-control" 
            {...register("password", {required: `Password is required.`,
            minLength:{
              value:6, message:"Must be at least 6 characters."

            }})} />
            {errors.password && (
                <span className="text-danger">{errors.password.message}</span>
            )}
          </label>
          <label className="form-label col-md-6">Confirm New Password
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
            {errors.confirmPassword && (
                <span className="text-danger">{errors.confirmPassword.message}</span>
            )}
          </label>
        </div>
        <span className="">
          <button  type="submit" className="btn btn-dark fw-medium mt-3"> 
            Reset Password
          </button>
        </span>
      </form>
    </FormProvider>  
  );
}

export default ManageResetPasswordForm;

