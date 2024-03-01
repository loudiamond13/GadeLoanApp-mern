import { useParams } from "react-router-dom";
import CustomerTransactionList from "../../components/CustomerTransactionList";
import * as apiClient from '../../api-client';
import { useQuery } from "react-query";


const EditCustomerTransaction =()=>
{
  const {customer_id} = useParams();

  const {data:transactionData} = useQuery('fetchCustomerTransactions', ()=> apiClient.fetchCustomerTransactions(customer_id || '')); 

  return(<CustomerTransactionList transaction={transactionData}/>);
}

export default EditCustomerTransaction;