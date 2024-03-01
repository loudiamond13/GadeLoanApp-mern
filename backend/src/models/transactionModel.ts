import mongoose from "mongoose";


export type TransactionsType = 
{
  _id: string;
  customer_id: string;
  totalLoan: number;
  totalPayment: number;
  totalBalance: number;
  loanTransactions: LoanTransaction[];
  paymentTransactions: PaymentTransaction[];

};

interface LoanTransaction {
  amount: number;
  date: Date;
  transaction_code: string;
  status: 'approved' | 'pending';
}

interface PaymentTransaction {
  amount: number;
  date: Date;
  transaction_code: string;
  status: 'approved' | 'pending';
}

const transactionSchema = new  mongoose.Schema<TransactionsType>
({
  customer_id : {type: String , required: true},
  totalLoan : {type: Number ,  default: 0},
  totalPayment: {type:Number ,default: 0 },
  totalBalance:{type:Number,  default: 0}, // this will be calculated by the server side code
  loanTransactions: 
  [{
    amount:Number,
    date: Date,
    transaction_code:{type: String, default: 'Loan'},
    status: {type: String, enum: ['approved', 'pending']}
  }],
  paymentTransactions:[{
    amount:Number,
    transaction_code:{type: String, default: 'Pay'},
    date: Date,
    status: {type: String, enum: ['approved', 'pending']}
  }],
});


transactionSchema.pre<TransactionsType>('save', function (next) {
  const { loanTransactions, paymentTransactions } = this;

  // Calculate totalLoan
  const totalLoan = loanTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  // Calculate totalPayment
  const totalPayment = paymentTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  // Calculate totalBalance
  const totalBalance = totalLoan - totalPayment;

  // Update document fields
  this.totalLoan = totalLoan;
  this.totalPayment = totalPayment;
  this.totalBalance = totalBalance;

  next();
});


const Transaction = mongoose.model<TransactionsType>(`Transaction`, transactionSchema);
export  default Transaction;