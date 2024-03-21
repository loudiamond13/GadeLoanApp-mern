import { useQuery } from "react-query";
import * as apiClient from '../../api-client';
import { useParams } from "react-router-dom";


import PaymentForm from "../../forms/PaymentForm/PaymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../../contexts/AppContext";



const CreatePayment = ()=>
{
  const {stripePromise} = useAppContext();
  const {customer_id, paymentTransaction_id} = useParams();

  
   // Fetch customer data
   const { data: customerData } = useQuery('fetchCustomer', 
      ()=> apiClient.fetchCustomer(customer_id || ''), { enabled: !!customer_id });


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