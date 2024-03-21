import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from '../../api-client';
import { useAppContext } from "../../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";

export type SignInFormData = 
{
  email: string;
  password: string;
};

const SignIn =()=>
{
  const queryClient = useQueryClient();
  const {showToast} = useAppContext();
  //navigate 
  const navigate = useNavigate();
  //react hook form
  const {register, handleSubmit, formState:{errors}} = useForm<SignInFormData>();

  //mutation  for sign in
  //communication  with to the  server
  //passed in the fetch request
  const mutation = useMutation(apiClient.signIn, 
    {onSuccess: async ()=>{
      //show the toast message 
      showToast({message: `Signed in Successfully!`, type:  `success`});
      await queryClient.invalidateQueries('validateToken');
      //navigate to the homepage
      navigate("/");
    },onError: (error: Error)=>{
      //show/toast the error  message
      showToast({message:  error.message ,type:`error`})
    }

  });

  //onsubmit function
  const onSubmit = handleSubmit((data) => 
  {
    mutation.mutate(data);
  })

  return(
    <form onSubmit={onSubmit} className=" row mb-5" >
         <h1 className="fw-bold text-dark">Sign in</h1>
         <div className="row">
            <label  className="form-label col-md-6">Email
              <input type="email" className="form-control"
              {...register(`email`,{required: `Email is required.`})}/>
              {
                errors.email && 
                (<span className="text-danger">{errors.email.message}</span>)
              }
            </label>
            <label className="form-label col-md-6">Password
              <input type="Password" className="form-control"
              {...register('password',{
                required:'Password is required.',
                minLength:  {value:6,message:"Should be at least 6 characters."},
              })}/>
              {
                //displays the error message
                errors.password && 
                (<span className="text-danger">{errors.password.message}</span>)
              }
            </label>
            <Link to='/forgot-password' className="my-2">Forgot Password?</Link>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-dark fw-medium">Sign In</button>
        </div>
      </form>
  );
};

export  default SignIn;