import { useMutation, useQuery } from "react-query";
import { useAppContext } from "../../contexts/AppContext";
import * as apiClient from '../../api-client';
import UserForm from "../../forms/UserForm/UserForm";
import {  useNavigate } from "react-router-dom";



const EditUserProfile =()=>
{
  const {showToast} = useAppContext();
  const navigate = useNavigate();
  const {data: user} = useQuery("fetchCurrentUser", apiClient.fetchCurrentUser);

  const {mutate} = useMutation(apiClient.updateUserByID,
  {
    onSuccess: ()=>
    {
      showToast({message:'Your account has been updated!', type:'success'});
      navigate(`/`);
    },
    onError: (error:Error) =>
    {
      showToast({message: error.message , type:'error'});
    }
  });

  const handleSubmit = (userFormData: FormData) =>
  {
    mutate(userFormData)
  }
  
  return(<UserForm onSave={handleSubmit} user={user}/>);
} ;


export default EditUserProfile;