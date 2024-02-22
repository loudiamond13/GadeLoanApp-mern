import { useMutation, useQuery } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from '../api-client';
import ManageUserForm from "../forms/ManageUser/ManageUserForm";
import {  useNavigate } from "react-router-dom";



const EditUserProfile =()=>
{
  const {user_id,showToast} = useAppContext();
  const navigate = useNavigate();
  const {data: user} = useQuery("fetchUserByID", ()=> apiClient.fetchUserByID(user_id));

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
  
  return(<ManageUserForm onSave={handleSubmit} user={user}/>);
} ;


export default EditUserProfile;