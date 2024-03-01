 import { useQuery } from "react-query";
 import { useParams } from "react-router-dom";
import * as apiClient from '../../api-client';
import {  FormProvider, useForm } from "react-hook-form";
import { TransactionsType } from "../../../../backend/src/models/transactionModel";
import { useEffect } from "react";
import Decimal from "decimal.js";
import TransactionDetailsSection from "./TransactionDetailsSection";
import CustomerTransactionList from "../../components/CustomerTransactionList";


export type CustomerTransactionData =
{
  customer_id: string;
  transaction_code: string;
  amount: Decimal;
  date: Date;
}

type Props =
{
  transaction?: TransactionsType ;
  onUpdate:(customerTransactionData:FormData) => void
}

const ManageTransactionForm = ({onUpdate, transaction}:Props) => 
{
  const formMethods = useForm<CustomerTransactionData>();
  const { handleSubmit, reset} = formMethods;

  const {customer_id} = useParams();
  const {data:customer} = useQuery('fetchCustomer', ()=> apiClient.fetchCustomer(customer_id || ''))

  useEffect(()=>
  {
    reset(transaction);
  },[transaction,reset]);

  const onSubmit = handleSubmit((formDataJson: CustomerTransactionData) =>
  {
    const formData = new FormData();
    if(transaction)
    {
      formData.append('transaction_id', transaction._id)
      formData.append('customer_id', transaction.customer_id);
    }
    formData.append('amount', formDataJson.amount.toString());
    formData.append('date', formDataJson.date.toString())

    onUpdate(formData);
  });

  return(
    <FormProvider {...formMethods}>
      <div>
        <img className="float-end d-none d-xl-block img-thumbnail" style={{ height: '200px', width: '200px' }} src={customer?.imageUrl[0]} alt="" />
      </div>
      <form onSubmit={onSubmit}>
        <h3>Create Customer Transaction</h3>
        <h5 className="fw-medium">Customer Name: {customer?.firstName + ' '+ customer?.lastName}</h5>
        <p>Total Loan: ${transaction?.totalLoan.toFixed(2)}</p>
        <p>Total Payment: ${transaction?.totalPayment.toFixed(2)}</p>
        <p>Balance: ${transaction?.totalBalance.toFixed(2)}</p>
        
        <TransactionDetailsSection />
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




export default ManageTransactionForm