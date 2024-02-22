import { useMutation } from "react-query";
import ManageCustomerForm from "../forms/ManageCustomer/ManageCustomerForm";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from '../api-client';

const CreateCustomer = () => 
{
  const {showToast} = useAppContext();

  const {mutate, isLoading} = useMutation(apiClient.createCustomer, 
    {
      onSuccess: () =>
      {
        showToast({message: "Customer created successfully.", type:"success"});
      },
      onError: ()=>
      {
        
        showToast({message: `Email might be in used/You're not authorized.` , type:'error'})
      }
    });

  const handleCreate = (customerFormData:FormData)=> 
  {
    mutate(customerFormData);
  }

  return(<ManageCustomerForm onCreate={handleCreate} isLoading={isLoading}/>);
}

export default  CreateCustomer;