import { useQuery, useQueryClient } from "react-query";
import * as apiClient from '../../api-client';
import { Link, useParams } from "react-router-dom";
import { LoanStatus, numberWithCommas } from "../../../../backend/src/utilities/constants";
import { useAppContext } from "../../contexts/AppContext";
import Pagination from "../../components/Pagination";
import { useState } from "react";
import { LoanType } from "../../../../backend/src/models/loanModel";
import CustomerLoanFilterBar from "../../components/CustomerLoanFilterBar";



interface Customer {
  firstName: string;
  lastName: string;
}

const CustomerLoanList = () => {
  const { customer_id } = useParams();
  const {showToast} = useAppContext()
  const queryClient = useQueryClient();
  const [pageNumber, setPageNumber] = useState(1);
  const [status, setStatus] = useState('');
  const [interestRate, setInterestRate] = useState('');


  // Fetch the customer
  const { data: customer } = useQuery<Customer>('fetchCustomer', () => apiClient.fetchCustomer(customer_id || ''));

  // Fetch the customer's loans
  const { data: loanListData, isLoading } = useQuery(['fetchCustomerLoans', status,pageNumber], 
                      () => apiClient.fetchCustomerLoans(customer_id || '',status,pageNumber));

  
  if(!loanListData)
  {
    return <h3 className="text-center">Loading...</h3>;
  }

  const handleApproveLoan = async (loan_id: string) => {
    try 
    {
      await apiClient.approveLoan(loan_id || '', interestRate);
      queryClient.invalidateQueries('fetchCustomerLoans');
      showToast({message:'Loan Approved!', type:'success'});
      setInterestRate('')// clear the interestRate
    } 
    catch (error) 
    {
      showToast({message: 'Error on approving loan.', type:'error'});
    }
  };

  const handleDeclineLoan = async (loan_id: string) => 
  {
    try 
    {
      await apiClient.declineLoan(loan_id || '');
      queryClient.invalidateQueries('fetchCustomerLoans');
      showToast({message: 'Loan Declined!', type: 'success'}) ;
    } 
    catch (error) 
    {
      showToast({message: 'Error on declining a loan.', type: 'error'})  ;
    }
  };

  const handleRefundLoan = async(loan_id: string) => 
  {
    try 
    {
      await apiClient.refundLoan(loan_id || '');
      queryClient.invalidateQueries('fetchCustomerLoans');
      showToast({message:'Loan Refunded!', type:'success'});
    } 
    catch (error) 
    {
      showToast({message: 'Error on refunding loan.', type:'error'});
    }
  };

  const handleCancelLoan = async(loan_id: string)=>
  {
    try {
      await apiClient.cancelLoan(loan_id || '');
      queryClient.invalidateQueries('fetchCustomerLoans');
      showToast({message: 'Loan canceled.', type: 'success'});
    } 
    catch (error) {
      showToast({message: 'Error on canceling loan.', type: 'error'});
    }
  }

  const handlePageChange =(page:number)=>
  {
    setPageNumber(page);
  }

  const handleFilter = (status: string) =>
  {
    setStatus(status);
    setPageNumber(1);  // reset pagination to page 1 when search term or branch changes
  }


  return (
    <div className="row">
      <h3 className="text-dark">Customer Loans</h3>
      <div className="col-5">
        <h5>Name: {`${customer?.firstName} ${customer?.lastName}`}</h5>
      </div>
      <div className=" justify-content-end my-1">
        <CustomerLoanFilterBar onFilter={handleFilter} />
      </div>
      <div className="text-center">
        {isLoading && <h3 className="mt-2">Loading...</h3>}
        {!isLoading && (!loanListData.loans || !loanListData.loans.length) ? (
          <h3 className="mt-2">No Loan Found...</h3>
        ) : (
          <div className="row">
            <div className="table-responsive">
              <table className="table table-bordered table-hover shadow">
                <thead className="table-dark">
                  <tr>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Total Paid</th>
                    <th>IR%</th>
                    <th className="text-center">Action</th>
                    
                  </tr>
                </thead>
                <tbody>
                {loanListData.loans?.map((loan: LoanType) => (
                  <tr key={loan._id}>
                    <td>${numberWithCommas(loan.amount)}</td>
                    <td>{loan.status}</td>
                    <td>${numberWithCommas(loan.totalPayment)}</td>
                    <td>
                      {loan.status === LoanStatus.PENDING ? (
                        <>
                        <input type="number" style={{width:'40px'}} 
                          defaultValue={loan.interestRate*100} 
                          onChange={(event)=> setInterestRate(event.target.value)}/>
                        <span style={{marginLeft: '5px'}}>%</span>
                        </>
                      ) :(
                        <>{loan.interestRate * 100} %</>
                        )}
                    </td>
                    <td className="text-center">
                      {loan.status === LoanStatus.PENDING && (
                        <>
                          <button onClick={() => handleApproveLoan(loan._id)} 
                            className="btn btn-outline-primary m-1 fw-medium">
                            Approve
                          </button>
                          <button onClick={() => handleDeclineLoan(loan._id)} 
                            className="btn btn-outline-danger m-1 fw-medium">
                            Decline
                          </button>
                        </>
                      )}
                      {loan.totalPayment !== 0 && loan.status === LoanStatus.APPROVED && (
                        <button onClick={() => handleRefundLoan(loan._id)} 
                          className="btn btn-outline-warning mx-1 fw-medium">
                          Refund
                        </button>
                      )}
                      {loan.totalPayment === 0 && loan.status === LoanStatus.APPROVED && (
                        <button onClick={() => handleCancelLoan(loan._id)} 
                          className="btn btn-outline-danger mx-1 fw-medium">
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
            {loanListData.totalPages > 1 && (
              <Pagination 
                totalPages={loanListData.totalPages}
                currentPage={pageNumber}
                onPageChange={handlePageChange} />
            )}
          </div>
        )}
      </div>
      <span>
        <Link to="/customers" className="btn btn-outline-dark mt-1 me-2">Back</Link>
      </span>
    </div>
);
}

export default CustomerLoanList;
