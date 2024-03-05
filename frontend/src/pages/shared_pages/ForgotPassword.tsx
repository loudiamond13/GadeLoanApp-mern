import { useMutation } from "react-query";
import * as apiClient from '../../api-client';
import { useAppContext } from "../../contexts/AppContext";
import { useForm } from "react-hook-form";


export type ForgotPasswordData = 
{
  email: string;
};


const ForgotPassword=()=>
{
  const{showToast} = useAppContext();
  const {register, handleSubmit, formState: { errors }} = useForm<ForgotPasswordData>();

  const mutation = useMutation(apiClient.forgotPassword,
    {
      onSuccess: ()=>
      {
        showToast({message: 'Check your email to reset password.',  type:'success'});
      },
      onError: (error:Error)=>
      {
        showToast({message: error.message, type: 'error'});
      }
    });

    const  onSubmit = handleSubmit((data) =>
    {
      const formData = new FormData();
      formData.append('email', data.email); // Add email to form data
      mutation.mutate(formData);
    });

  return(
  <div>
    <form onSubmit={onSubmit}>
    <h1 className="fw-bold my-3">Forgot Password</h1>
         <div className="row my-2">
            <label  className="form-label col-md-6">Email:
              <input type="email" className="form-control"
              {...register(`email`,{required: `Email is required.`})}/>
              {
                errors.email && 
                (<span className="text-danger">{errors.email.message}</span>)
              }
            </label>
          </div>
          <div className="col-12 my-2">
          <button type="submit" className="btn btn-dark fw-medium" disabled={mutation.isLoading}>Forgot Password</button>
        </div>
      </form>
  </div>
  );
}


export default ForgotPassword;