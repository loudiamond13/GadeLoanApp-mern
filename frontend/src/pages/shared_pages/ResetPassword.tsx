import { useMutation } from "react-query";
import { useAppContext } from "../../contexts/AppContext";
import * as apiClient from '../../api-client';
import { useNavigate } from "react-router-dom";
import ManageResetPasswordForm from "../../forms/ManageResetPassword/ManageResetPasswordForm";


const ResetPassword = () =>
{
  const navigate = useNavigate();
  const {showToast} = useAppContext();
  const {mutate} = useMutation(apiClient.resetPassword,
    {
      onSuccess: () => 
      {
        showToast({message: 'Password reset successfully!', type:'success'});
        navigate('/sign-in');
      },
      onError: (error: Error) => 
      {
        showToast({message: error.message, type:'error'});
      }
  });

  const handleReset = (resetPasswordData: FormData)=>
  {
    mutate(resetPasswordData);
  }
  return(<ManageResetPasswordForm onReset={handleReset}/>);
}

export default ResetPassword;