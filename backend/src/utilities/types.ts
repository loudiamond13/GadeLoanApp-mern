import { LoanType } from "../models/loanModel";
import { UserType } from "../models/userModel";

export type PaymentIntentResponse =
{
  paymentIntent_id: string;
  clientSecret: string;
  message:string;
  totalPaid:number
}

export type LoanListResponse =
{
  loans: LoanType[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export type UserListResponse = 
{
  users: UserType[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}