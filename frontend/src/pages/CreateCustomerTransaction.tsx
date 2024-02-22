
import { useAppContext } from "../contexts/AppContext";
import ManageTransactionForm from "../forms/ManageTransaction/ManageTransactionForm";
import * as apiClient from '../api-client'
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";


const CreateCustomerTransaction =()=>
{ 
  const {showToast} = useAppContext();

  const{customer_id} = useParams();

  const {data:transaction} = useQuery('fetchCustomerTransactions', ()=> apiClient.fetchCustomerTransactions(customer_id || ''),
  {
    enabled: !!customer_id
   });

  const {mutate} = useMutation(apiClient.updateCustomerTransaction, 
    {
      onSuccess:() => {
        showToast({message: "Updated Trans", type:'success'});
        window.location.reload();
      },
      onError:() => {
        showToast({message:'error trans', type: 'error'});
      }
    });

  const  handleSubmit= (customerTransactionData:FormData) =>
   {
     mutate(customerTransactionData);
  }

  return (<ManageTransactionForm transaction={transaction} onUpdate={handleSubmit} />);
}

export  default CreateCustomerTransaction;