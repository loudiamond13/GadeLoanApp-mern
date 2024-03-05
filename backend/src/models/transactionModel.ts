import mongoose from "mongoose";


export type TransactionsType = 
{
  _id: string;
  customer_id: string;
  totalLoan: number;
  totalPayment: number;
  totalBalance: number;
 
  payDate: Date;
  loanTransactions: LoanTransaction[];
  paymentTransactions: PaymentTransaction[];

};

interface LoanTransaction {
  amount: number;
  date: Date;
  payDate:  Date;
  loanTerm: number; // in months
  interestRate: number;
  paymentSchedule: 'Monthly' | 'Bi-weekly';
  amountPerDue:  number;
  status: 'Active' | 'Inactive';
  transaction_code: string;
  employee_admin_approval: 'approved' | 'pending';
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
  totalBalance:{type:Number,  default: 0}, 
  
  
  loanTransactions: 
  [{
    amount:{type: Number},
    date: {type:Date},
    interestRate: {type: Number,default: 0.05},
    loanTerm: {type: Number},
    payDate: {type: Date},
    amountPerDue: {type: Number, default: 0},
    paymentSchedule: { type:String , enum:['Monthly','Bi-weekly'] , default:'Monthly'},
    status: {type:String ,enum: ['Active', 'Inactive'], default:'Inactive'},
    transaction_code:{type: String, default: 'Loan'},
    employee_admin_approval: {type: String, enum: ['Approved', 'Pending']}
  }],
  paymentTransactions:[{
    amount:{type: Number},
    transaction_code:{type: String, default: 'Pay'},
    date:{type: Date},
    status: {type: String, enum: ['Approved', 'Pending']}
  }],
});


transactionSchema.pre<TransactionsType>('save', function (next) {
  const { loanTransactions } = this;

  // Calculate totalLoan including interest
  const totalLoan = loanTransactions.reduce((total, transaction) => {
    // Calculate total loan with interest
    const loanAmountWithInterest = transaction.amount + (transaction.amount * transaction.interestRate);
    return total + loanAmountWithInterest;
  }, 0);

  // Calculate totalPayment
  const totalPayment = this.paymentTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  // Calculate totalBalance
  const totalBalance = totalLoan - totalPayment;

  // Update document fields
  this.totalLoan = totalLoan;
  this.totalPayment = totalPayment;
  this.totalBalance = totalBalance;

 // Calculate amountPerDue
 const activeLoans = loanTransactions.filter(loan => loan.status === 'Active');
 if (activeLoans.length > 0) {
   activeLoans.forEach((loan) => {

    //calculate the amount per due
    const currentLoanWithInterest = loan.amount + (loan.amount * loan.interestRate)
     loan.amountPerDue = currentLoanWithInterest / loan.loanTerm;
     
     if (loan.paymentSchedule === 'Bi-weekly') {
       // If payment schedule is bi-weekly, set payDate every 14 days
       loan.payDate = new Date(loan.date.getTime());
       loan.payDate.setDate(loan.payDate.getDate() + 15); // Add 14 days
     } else if (loan.paymentSchedule === 'Monthly') {
       // If payment schedule is monthly, set payDate every 1 month
       loan.payDate = new Date(loan.date.getTime());
       loan.payDate.setMonth(loan.payDate.getMonth() + 1); // Add 1 month
       loan.payDate.setDate(loan.payDate.getDate() + 1);
     }
   });
 }


  next();
});



const Transaction = mongoose.model<TransactionsType>(`Transaction`, transactionSchema);
export  default Transaction;