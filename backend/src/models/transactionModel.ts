
import Decimal from "decimal.js";
import mongoose from "mongoose";


export type TransactionsType = 
{
  _id: string;
  customer_id: string;
  totalLoan: number;
  totalPayment: number;
  totalBalance: number;
  transactions: [{_id: string,amount :number,transaction_code:string, date:Date}];
};


// export type transactionType = 
// {
//   amount: number;
//   transaction_code: string;
//   date:Date;
// };

const transactionSchema = new  mongoose.Schema<TransactionsType>
({
  customer_id : {type: String , required: true},
  totalLoan : {type: Number ,  default: 0},
  totalPayment: {type:Number ,default: 0 },
  totalBalance:{type:Number,  default: 0}, // this will be calculated by the server side code
  transactions: 
  [{
    amount:Number,
    transaction_code:String,
    date: Date,
  }]
});


const Transaction = mongoose.model<TransactionsType>(`Transaction`, transactionSchema);
export  default Transaction;