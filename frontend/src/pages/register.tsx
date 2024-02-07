import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from  "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormData = 
{
  firstName: string, 
  lastName: string,  
  email: string, 
  password: string, 
  confirmPassword: string
};

const Register =() =>
{
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {showToast} = useAppContext(); // toast message
  const {register, watch, handleSubmit, formState:{errors}} = useForm<RegisterFormData>();

   //mutation  for sign up
  //communication  with to the  server
  //passed in the fetch request
  const mutation = useMutation(apiClient.register, 
    {
      //if registration was successful
      onSuccess: async ()=>
      {
        showToast({message: "Registration Successful!", type:"success"});
        await queryClient.invalidateQueries('validateToken');
        navigate(`/`); // navigate to homepage
      },
      //if registration has error, send errror messsage
      onError:(error: Error) => 
      {
         showToast({message:  error.message, type:"error"});
      }
    });


    //when executed, it will call the register function on ../api-client  and pass in the data from this form
  const onSubmit = handleSubmit((data)=>{
    mutation.mutate(data);
  });

  return(
     
      <form className=" row mb-5" onSubmit={onSubmit}>
         <h1 className="fw-bold">Create An Account</h1>
         <div className="row">
            <label  className="form-label col-md-6">First Name
              <input type="text" className="form-control" 
              {...register("firstName",{required: `First name is required.`})}/>
              {errors.firstName && 
              (
                <span className="text-danger">{errors.firstName.message}</span>
              )}
            </label>
            <label className="form-label col-md-6">Last Name
              <input type="text" className="form-control"
               {...register("lastName",{required: `Last name is required.`})}/>
               {errors.lastName && (
               <span className="text-danger">{errors.lastName.message}</span>
               )}
            </label>
        </div>
        <div className="row">
          <label className="form-label col-md-12">Email
            <input type="email" className="form-control "  placeholder="example@email.com" 
            {...register("email",{required:`Please provide an email address.`})} />
            {errors.email && 
            (
               <span className="text-danger">{errors.email.message}</span>
            )}
          </label>
        </div>
        <div className="row">
            <label className="form-label col-md-6">Password
              <input type="password" className="form-control" 
              {...register("password", {required: `Password is required.`,
              minLength:{
                value:6, message:"Must be at least 6 characters."

              }})} />
              {errors.password && (
                 <span className="text-danger">{errors.password.message}</span>
              )}
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
              {errors.confirmPassword && (
                 <span className="text-danger">{errors.confirmPassword.message}</span>
              )}
            </label>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-dark fw-medium">Create Account</button>
        </div>
      </form>
  
  );
};



export default Register;