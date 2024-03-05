import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from '../../api-client';
import {  FormProvider, useForm } from "react-hook-form";
import { TransactionsType } from "../../../../backend/src/models/transactionModel";
import { useEffect } from "react";
import Decimal from "decimal.js";
import CustomerTransactionList from "../../components/CustomerTransactionList";
import PaymentTransactionDetailsSection from "./PaymentTransactionDetailsSection";
import { numberWithCommas } from "../../../../backend/src/utilities/constants";



export type CustomerPaymentTransactionData =
{
 customer_id: string;
 transaction_code: string;
 amount: Decimal;
 date: Date;
}

type Props =
{
 transaction?: TransactionsType ;
 onUpdate:(customerPaymentTransactionData:FormData) => void
}

const ManagePaymentTransactionForm = ({onUpdate, transaction}:Props) => 
{
 const formMethods = useForm<CustomerPaymentTransactionData>();
 const { handleSubmit, reset} = formMethods;

 const {customer_id} = useParams();
 const {data:customer} = useQuery('fetchCustomer', ()=> apiClient.fetchCustomer(customer_id || ''))

 useEffect(()=>
 {
   reset(transaction);
 },[transaction,reset]);

 const onSubmit = handleSubmit((formDataJson: CustomerPaymentTransactionData) =>
 {
   const formData = new FormData();
   if(transaction)
   {
     formData.append('transaction_id', transaction._id);
     formData.append('customer_id', transaction.customer_id);
   }
   formData.append('amount', formDataJson.amount.toString());
   formData.append('date', formDataJson.date.toString())

   onUpdate(formData);
 });

 return(
   <FormProvider {...formMethods}>
      <div>
       <img className="float-end d-none d-lg-block img-thumbnail customerImage" 
        src={customer?.imageUrl[0]} 
        alt={`${customer?.firstName} image`} />
      </div>
     <form onSubmit={onSubmit}>
       <h3 className="mb-3">Create Customer Payment Transaction</h3>
       <h5 className="fw-medium">Customer Name: {customer?.firstName + ' '+ customer?.lastName}</h5>
       <p>Total Loan: ${numberWithCommas(transaction?.totalLoan)}</p>
       <p>Total Payment: ${numberWithCommas(transaction?.totalPayment)}</p>
       <p>Balance: ${numberWithCommas(transaction?.totalBalance)}</p>
       
       <PaymentTransactionDetailsSection />
       <span>
         <button className="btn btn-dark" type="submit">
               Process Payment
         </button>
       </span>
     </form>
     <div>
       <CustomerTransactionList transaction={transaction}/>
     </div>
   </FormProvider>
 );
};




export default ManagePaymentTransactionForm;