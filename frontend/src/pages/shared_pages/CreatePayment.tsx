import { useQuery } from "react-query";
import * as apiClient from '../../api-client';
import { useParams } from "react-router-dom";


import PaymentForm from "../../forms/PaymentForm/PaymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../../contexts/AppContext";
import { UserRole } from "../../../../backend/src/utilities/constants";


const CreatePayment = ()=>
{
  const {stripePromise, userRole} = useAppContext();
  const {customer_id, paymentTransaction_id} = useParams();

  // Define query function based on user role
  const fetchCustomerData = async () => {
    if (userRole === UserRole.CUSTOMER) {
      return apiClient.fetchCurrentUser(); // Fetch current user data
    } else {
      return apiClient.fetchCustomer(customer_id || ''); // Fetch customer data by ID
    }
  };
  
   // Fetch customer data
   const { data: customerData } = useQuery(['fetchCustomer', customer_id || ''], fetchCustomerData);


  const {data: paymentIntentData} = useQuery('createPaymentIntent', 
      ()=> apiClient.createPaymentIntent(customer_id|| '', paymentTransaction_id ||''));

  const {data: paymentData} = useQuery('fetchCustomerPaymentTransactionByID', 
      ()=> apiClient.fetchCustomerPaymentTransactionByID(customer_id || '', paymentTransaction_id || ''));


  return(
    <Elements stripe={stripePromise} options={{clientSecret: paymentIntentData?.clientSecret}}>
      <PaymentForm paymentIntent={paymentIntentData} paymentData={paymentData} customer={customerData}/>
    </Elements>
  );
}

export default CreatePayment;