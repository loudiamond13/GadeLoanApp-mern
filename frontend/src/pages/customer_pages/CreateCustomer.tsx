import { useMutation } from "react-query";
import ManageCustomerForm from "../../forms/CustomerForm/CustomerForm";
import { useAppContext } from "../../contexts/AppContext";
import * as apiClient from '../../api-client';


const CreateCustomer = () => 
{
  
  const {showToast} = useAppContext();

  const {mutate, isLoading} = useMutation(apiClient.createCustomer, 
    {
      onSuccess: async () =>
      {
        showToast({message: 'Successfully Registered.', type:"success"});
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