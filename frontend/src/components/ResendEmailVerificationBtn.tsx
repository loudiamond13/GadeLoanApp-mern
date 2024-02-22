
import { useMutation } from "react-query";
import * as apiClient from '../api-client';
import { useAppContext } from "../contexts/AppContext";
import { Link } from "react-router-dom";

type Props = {user_id: string;}

const ResendVerificationBtn = ({user_id}:Props) => 
{
  const {showToast} = useAppContext();

  console.log('BUTOON RESEND', user_id)

  const mutation = useMutation(()=> apiClient.resendEmailVerification(user_id),
  {
    onSuccess: async()=>
    {
      showToast({message:'Email Verification Sent!', type:'success'});
    },
    onError:(error:Error) =>
    {
      showToast({message: error.message, type:'error'})
    }
  })

  const handleClick =()=>
  {
    mutation.mutate();
  }

  return(<Link to='#' onClick={handleClick}>Resend Verification Email</Link>);

}

export default ResendVerificationBtn;