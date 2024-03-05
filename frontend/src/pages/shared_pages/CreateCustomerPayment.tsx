
import { useAppContext } from "../../contexts/AppContext";
import * as apiClient from '../../api-client'
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import ManagePaymentTransactionForm from "../../forms/ManageTransaction/ManagePaymentTransactionForm";


const CreateCustomerTransaction =()=>
{ 
  const {showToast} = useAppContext();
  const queryClient = useQueryClient();
  const{customer_id} = useParams();

  const {data:transaction} = useQuery('fetchCustomerTransactions', ()=> apiClient.fetchCustomerTransactions(customer_id || ''),
  {
    enabled: !!customer_id
   });

  const {mutate} = useMutation(apiClient.createCustomerPayment, 
    {
      onSuccess:async()  => {
        await queryClient.invalidateQueries('fetchCustomerTransactions');
        showToast({message: "Payment transaction submitted.", type:'success'});
        
      },
      onError:() => {
        showToast({message:'Error on processing payment transaction', type: 'error'});
      }
    });

  const  handleSubmit= (customerPayementTransactionData:FormData) =>
   {
     mutate(customerPayementTransactionData);
  }

  return (<ManagePaymentTransactionForm transaction={transaction} onUpdate={handleSubmit} />);
}

export  default CreateCustomerTransaction;