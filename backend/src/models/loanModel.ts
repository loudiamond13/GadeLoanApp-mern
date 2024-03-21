import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";

export type LoanType =
{
  _id: string;
  customer: Customer;
  amount: number;
  amountWithInterest: number;
  totalPayment: number;
  balance: number;
  amountPerDue:  number;
  interestRate: number;
  loanTerm: number; // in months
  // employee_admin_approval: 'Approved' | 'Pending' | 'Declined' | 'Canceled';
  status: 'Approved'| 'Paid' | 'Pending' | 'Declined' | 'Canceled'|'Refunded';
  paymentDueDate:  Date;
  date: Date;
  paymentSchedule: 'Monthly'|'Bi-weekly';
  paymentTransactions: PaymentTransaction[];
}

interface Customer{
  _id: string;
  firstName: string; 
  lastName: string;
  email: string
}

export interface PaymentTransaction {
  _id: string;
  amount: number;
  dueDate: Date; 
  transactionType: string; 
  status: 'Paid' | 'Unpaid'|'Refunded';
  paidDate: Date |null;
  stripePaymentId: string;
 // stripeRefundId:string;
}


const loanSchema = new  mongoose.Schema<LoanType>({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true }, // Reference to Customer model
  amount : {type: Number, required: true},
  amountWithInterest: {type:Number ,default: 0},
  totalPayment: {type: Number, default: 0},
  balance: {type: Number, default: 0},
  interestRate: {type:Number ,default: 0.05},
  loanTerm:{type:Number ,default: 0},
  paymentSchedule: { type:String , enum:['Monthly','Bi-weekly'] , default:'Monthly'},
  // employee_admin_approval: {type: String, enum: ['Approved', 'Pending', 'Declined', 'Canceled'], default: 'Pending'},
  status: {type:String ,enum: ['Approved','Paid','Pending', 'Declined', 'Canceled',"Refunded"], default:'Pending'},
  date: {type: Date},
  paymentTransactions:[{
    amount:{type: Number},
    transactionType:{type: String, default: 'Pay'},
    dueDate:{type: Date}, // Changed from 'date' to 'dueDate'
    status: {type: String, enum: ['Paid', 'Unpaid','Refunded'], default: 'Unpaid'},
    paidDate: {type: Date},
    stripePaymentId: {type: String},
  
  }],
});


loanSchema.pre('save', function (next) {
  this.balance = parseFloat((this.amountWithInterest - this.totalPayment).toFixed(2));

  // Check if the balance is 0 and set the loan status accordingly
  if (this.balance === 0) {
    this.status = 'Paid';
  }


  // Check if the date field has been modified
  if (this.isModified('date')) {
    const paymentTransactions: PaymentTransaction[] = [];
    const startDate = new Date(this.date); // use the modified date

    // recalculate payment dates based on the modified date and payment schedule
    const amountPerDue = this.paymentSchedule === 'Bi-weekly' ? 
                      parseFloat(((this.amountWithInterest / this.loanTerm) / 2).toFixed(2)) 
                    : parseFloat((this.amountWithInterest / this.loanTerm).toFixed(2));


    const numberOfPayments = this.paymentSchedule === 'Bi-weekly' ? this.loanTerm * 2 : this.loanTerm;

    for (let i = 0; i < numberOfPayments; i++) {
      const paymentDate = new Date(startDate);

      if (this.paymentSchedule === 'Bi-weekly') {
        paymentDate.setDate(paymentDate.getDate() + (i + 1) * 14); // add 14 days for each payment
      } else if (this.paymentSchedule === 'Monthly') {
        paymentDate.setMonth(paymentDate.getMonth() + i + 1); // add 1 month for each payment
      }

      const paymentTransaction: PaymentTransaction = {
        _id: new ObjectId().toString(), // Generate a new ObjectId for each payment transaction
        amount: amountPerDue,
        dueDate: paymentDate,
        transactionType: 'Pay',
        status: 'Unpaid',
        paidDate: null,
        stripePaymentId: '',
        // stripeRefundId: '',
      };

      paymentTransactions.push(paymentTransaction);
    }

    // Update paymentTransactions in the document
    this.paymentTransactions = paymentTransactions;
  }
  next();
});




const Loan = mongoose.model<LoanType>(`Loan`, loanSchema);
export  default Loan;
