
import mongoose from "mongoose";


export type TransactionType = 
{
  _id: string;
  customer_id: string;
  transactions: transaction[];
};


export type transaction = 
{
  amount: number;
  transaction_code: string;
  date:Date;
};

const transactionSchema = new  mongoose.Schema<TransactionType>
({
  customer_id : {type: String , required: true},
  transactions: 
  [{
    amount:Number, required: true,
    transaction_code:String,
    date: Date,
  }],
});


const Transaction = mongoose.model<TransactionType>(`Transaction`, transactionSchema);
export  default Transaction;