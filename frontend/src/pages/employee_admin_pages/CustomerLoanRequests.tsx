import { useQuery, useQueryClient } from "react-query";
import * as apiClient from '../../api-client';
import { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { numberWithCommas } from "../../../../backend/src/utilities/constants";
import { LoanType } from "../../../../backend/src/models/loanModel";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import { Link } from "react-router-dom";

const CustomerLoanRequests = () => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const [interestRate, setInterestRate] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [searchString, setSearchString] = useState('');

  const { data: loanListData, isLoading } = useQuery(['getLoanRequests', pageNumber, searchString], () => apiClient.getLoanRequests(searchString, pageNumber));

  const handleApproveLoan = async (loan_id: string) => {
    try {
      await apiClient.approveLoan(loan_id || '', interestRate);
      queryClient.invalidateQueries('getLoanRequests');
      queryClient.invalidateQueries('getLoanRequestsCount');
      showToast({ message: 'Loan Approved!', type: 'success' });
      setInterestRate('')// clear the interestRate
    } catch (error) {
      showToast({ message: `${error}`, type: 'error' });
    }
  };

  const handleDeclineLoan = async (loan_id: string) => {
    try {
      await apiClient.declineLoan(loan_id || '');
      queryClient.invalidateQueries('getLoanRequests');
      queryClient.invalidateQueries('getLoanRequestsCount');
      showToast({ message: 'Loan Declined!', type: 'success' });
    } catch (error) {
      showToast({ message: 'Error on declining a loan.', type: 'error' });
      console.log(error)
    }
  };

  const handleSearch = (searchString: string) => {
    setSearchString(searchString);
    setPageNumber(1);
  }

  const handlePageChange = (pageNumber: number) => {
    setPageNumber(pageNumber);
  }

  if (isLoading) {
    return (<h3 className="text-center mt-3">Loading...</h3>);
  }

  return (
    <div className="row mt-2">
      <h3 className="mb-3 col text-dark">Loan Requests</h3>
      <div className="col-md justify-content-end d-flex">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="">
        {loanListData?.loans.length ? (
          <div className="table-responsive">
            <table className="table table-bordered table-hover shadow">
              <thead className="table-dark">
                <tr>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>IR %</th>
                  <th className='text-center'>Action</th>
                </tr>
              </thead>
              <tbody>
                {loanListData.loans.map((loan: LoanType) => (
                  <tr key={loan._id}>
                    <td>{loan.customer.firstName} {loan.customer.lastName}</td>
                    <td>{loan.customer.email}</td>
                    <td>${numberWithCommas(loan.amount)}</td>
                    <td>{loan.status}</td>
                    <td>
                      <>
                        <input type="number" style={{ width: '40px' }}
                          defaultValue={loan.interestRate * 100}
                          onChange={(event) => setInterestRate(event.target.value)} />
                        <span style={{ marginLeft: '5px' }}>%</span>
                      </>
                    </td>
                    <td className='text-center'>
                      {loan.status === 'Pending' && (
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loanListData.totalPages > 1 && 
              <Pagination
                totalPages={loanListData?.totalPages || 0}
                currentPage={pageNumber}
                onPageChange={handlePageChange} />
            }
          </div>
        ) : (
          <h3 className="text-center mt-3">No loan requests at this moment...</h3>
        )}
      </div>
      <span>
        <Link className="btn btn-outline-dark fw-medium" to='/'>Back</Link>
      </span>
    </div>
  );
}

export default CustomerLoanRequests;
