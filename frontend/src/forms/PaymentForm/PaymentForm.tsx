import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { PaymentTransaction } from "../../../../backend/src/models/loanModel";
import { PaymentIntentResponse } from "../../../../backend/src/utilities/types";
import { useMutation } from "react-query";
import * as apiClient from '../../api-client';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { useForm } from "react-hook-form";
import { StripeCardElement } from "@stripe/stripe-js";
import { useState } from "react";
import { numberWithCommas } from "../../../../backend/src/utilities/constants";
import { CustomerType } from "../../../../backend/src/models/customerModel";
import { UserType } from "../../../../backend/src/models/userModel";


export type PaymentFormData = 
{
  paymentIntent_id: string;
  customer_id: string;
  paymentTransaction_id: string;
  email:string;
}

type Props =
{
  paymentData?: PaymentTransaction;
  paymentIntent?: PaymentIntentResponse;
  customer?: UserType |CustomerType;
}

const PaymentForm=({paymentData, paymentIntent, customer}:Props)=>
{
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const {showToast}= useAppContext();
  const stripe = useStripe();
  const elements = useElements();
  const {customer_id, paymentTransaction_id} = useParams();

  const {mutate, isLoading} = useMutation(apiClient.createPayment,
  {
    onSuccess: ()=>
    {
      showToast({message: 'Payment Successful', type:'success'});
      navigate(`/customers/${customer_id}/loans`);
    },
    onError: (error: Error)=>
    {
      console.log(error)
      showToast({message: 'Error on paying  the loan', type:'error'});
    }
  });

  const {handleSubmit} = useForm<PaymentFormData>({
    defaultValues:{
      customer_id: customer_id,
      paymentTransaction_id: paymentTransaction_id,
      paymentIntent_id: paymentIntent?.paymentIntent_id || '',
      email: customer?.email
    }
  });

  const onSubmit = async(formData: PaymentFormData) => 
  {
    if(!stripe || !elements)
    {
      return;
    }

    const result = await stripe.confirmCardPayment(paymentIntent?.clientSecret || '', 
    {
      payment_method: {
        card: elements.getElement(CardElement) as StripeCardElement,
        billing_details: { email: email}
      },
     
    });

    if(result.paymentIntent?.status === "succeeded")
    {
      mutate({...formData, paymentIntent_id: result.paymentIntent.id})
    }
  }
  
  return (
    <form className="container-fluid justify-content-center align-items-center " onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="shadow p-4 rounded  bg-white">
            <h3 className="text-center mb-4">Payment Details</h3>
            <div className="my-2">
                <label htmlFor=""> Name: 
                  <input type="text" className="form-control" value={`${customer?.firstName} ${customer?.lastName}`} disabled/>
                </label>
              <p className="my-2">Amount Due: ${numberWithCommas(paymentData?.amount)}</p>
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="text" className="form-control" value={customer?.email} 
                onChange={(event) => setEmail(event.target.value)}/>
            </div>
            <div className="form-group">
              <label>Card Details:</label>
              <CardElement className="form-control border-1" />
            </div>
            <button
              type="submit" 
              className="btn btn-outline-primary fw-medium mt-2 me-2" 
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Confirm Payment"}
            </button>
            <span>
              <Link to={`/customers/${customer_id}/loans`} 
                  className="btn btn-outline-primary fw-medium mt-2">
                  Back
              </Link>
            </span>
          </div>
        </div>
      </div>
    </form>
  );
  
  
  
  
  
}

export default PaymentForm;