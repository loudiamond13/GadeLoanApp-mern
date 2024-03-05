import { useMutation, useQuery } from "react-query";
import ManageLoanTransactionForm from "../../forms/ManageTransaction/ManageLoanTransactionForm";
import { useNavigate, useParams } from "react-router-dom";
import * as apiClient from '../../api-client';
import { useAppContext } from "../../contexts/AppContext";

const CreateCustomerLoan =()=>
{
  const navigate = useNavigate();
  const {customer_id} = useParams();
  const {data:customer} = useQuery('fetchCustomer', ()=> apiClient.fetchCustomer(customer_id || '')); 
  const {showToast} = useAppContext();


  const {mutate} = useMutation(apiClient.createCustomerLoan,
    {
      onSuccess: ()=>
      {
        navigate('/customers');
        showToast({message:'Loan proccessed  successfully', type:"success"});
      },
      onError: (error: Error) =>
      {
        showToast({message: error.message, type: "error"});
      }
  });


  const handleSubmit = (customerLoanTransactionData: FormData) => 
  {
    mutate(customerLoanTransactionData);
  } 


  return(<ManageLoanTransactionForm handleSubmitData={handleSubmit} customer={customer}/>)
}

export default CreateCustomerLoan;