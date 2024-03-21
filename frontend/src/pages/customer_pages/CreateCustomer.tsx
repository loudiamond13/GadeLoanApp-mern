import { useMutation, useQueryClient } from "react-query";
import ManageCustomerForm from "../../forms/CustomerForm/CustomerForm";
import { useAppContext } from "../../contexts/AppContext";
import * as apiClient from '../../api-client';
import { useNavigate } from "react-router-dom";


const CreateCustomer = () => 
{
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {showToast} = useAppContext();

  const {mutate, isLoading} = useMutation(apiClient.createCustomer, 
    {
      onSuccess: async () =>
      {
        queryClient.invalidateQueries("validateToken");
        showToast({message: 'Successfully Registered.', type:"success"});
        navigate('/')
      },
      onError: (error: Error)=>
      {
        
        showToast({message: `${error}` || 'Error on creating an account.' , type:'error'})
      }
    });

  const handleCreate = (customerFormData:FormData)=> 
  {
    mutate(customerFormData);
  }

  return(<ManageCustomerForm onCreate={handleCreate} isLoading={isLoading}/>);
}

export default  CreateCustomer;