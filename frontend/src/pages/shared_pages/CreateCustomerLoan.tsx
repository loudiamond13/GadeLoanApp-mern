import { useMutation } from "react-query";
import LoanForm from "../../forms/LoanForm/LoanForm";
import { useNavigate, useParams } from "react-router-dom";
import * as apiClient from '../../api-client';
import { useAppContext } from "../../contexts/AppContext";
import { useEffect, useState } from "react";
import { UserRole } from "../../../../backend/src/utilities/constants";
import { CustomerType } from "../../../../backend/src/models/customerModel";

const CreateCustomerLoan =()=>
{
  const navigate = useNavigate();
  const {customer_id} = useParams();
  const {userRole, showToast} = useAppContext();
  const [customer, setCustomer] = useState<CustomerType>()

  //fetch customer details if use is admin/employee
  useEffect(()=>
  {
    if(userRole === UserRole.ADMIN || userRole === UserRole.EMPLOYEE)
    {
      const fetchCustomer = async() =>
      {
        const customerData = await apiClient.fetchCustomer(customer_id || '');
        setCustomer(customerData)
      }

      fetchCustomer();
    }
  },[customer_id, userRole]);


  const {mutate} = useMutation(apiClient.createCustomerLoan,
    {
      onSuccess: ()=>
      {
        if(userRole === UserRole.CUSTOMER)
        {
          showToast({message:'Loan requested successfully.', type:"success"});
          navigate('/');
        }
        else
        {
          showToast({message:'Loan proccessed successfully.', type:"success"});
          navigate('/customers');
        }
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


  return(<LoanForm handleSubmitData={handleSubmit} customer={customer}/>)
}

export default CreateCustomerLoan;