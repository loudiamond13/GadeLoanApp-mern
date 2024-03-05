import { useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { useMutation, useQuery } from "react-query";
import * as apiClient from '../../api-client';
import ManageCustomerForm from "../../forms/ManageCustomer/ManageCustomerForm";

const EditCustomer =()=>
{
  const {customer_id} = useParams();
  const {showToast} = useAppContext();

  const {data: customer} = useQuery('fetchCustomer',()=> apiClient.fetchCustomer(customer_id || ''));

  const {mutate, isLoading } = useMutation(apiClient.updateCustomer, 
  {
    onSuccess:()=>
    {
      showToast({message: `The customer has been updated`, type:'success'});
    },
    onError:()=>
    {
      showToast({message:`An error occurred while updating the customer`, type:"error"});
    }
  });

  const handleSubmit = (customerFormData: FormData) => 
  {
    mutate(customerFormData)
  }

 return(<ManageCustomerForm customer={customer} onCreate={handleSubmit} isLoading={isLoading}/>);
};


export default EditCustomer;