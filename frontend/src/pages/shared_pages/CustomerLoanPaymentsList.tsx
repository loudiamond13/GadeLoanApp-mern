import * as apiClient from '../../api-client'
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { Accordion, ListGroup } from "react-bootstrap";
import { UserRole, formatDateMMddYYYY, numberWithCommas } from "../../../../backend/src/utilities/constants";
import { useEffect, useState } from 'react';
import { LoanType } from '../../../../backend/src/models/loanModel';
import Pagination from '../../components/Pagination';
import { CustomerType } from '../../../../backend/src/models/customerModel';
import { useAppContext } from '../../contexts/AppContext';


const CustomerLoanPaymentsList =()=>
{ 
  const{customer_id} = useParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [customer, setCustomer] = useState<CustomerType>();
  const {userRole}= useAppContext();


  //fetch customer Data if user is admin/employee
  useEffect(() => 
  {
    if (userRole === UserRole.EMPLOYEE || userRole === UserRole.ADMIN) {
      const fetchCustomer = async () => {
        const customerData = await apiClient.fetchCustomer(customer_id || '');
        setCustomer(customerData);
      };
      
      fetchCustomer();
    }
  }, [userRole, customer_id]);


  const {data: loanListData} = useQuery(['fetchCustomerTransactions', '', pageNumber], 
                          ()=> apiClient.fetchCustomerLoans(customer_id || '','',pageNumber));
   
  if (!loanListData) {
    return <h3 className='text-center'>Loading...</h3>;
  }
                          

  const handlePageChange =(page: number)=>
  {
    setPageNumber(page);
  }

  return (
  <div className='row'>
    <h3 className='text-dark '>Loan Payments</h3>
    {userRole !== UserRole.CUSTOMER  &&
      <h5 className="fw-medium">Name: {customer?.firstName + ' ' + customer?.lastName}</h5>
    }

    {loanListData.loans.length === 0 ? 
    (
      <h3 className='text-center'>No loans yet.</h3>
    ) : (
    <Accordion className='my-2 rounded p-1 shadow'>
      {loanListData.loans.map((loan: LoanType) => (
      <Accordion.Item key={loan._id} eventKey={loan._id}>
        <Accordion.Header className="d-lg-none">
          <div>
            <span className="me-2">Amount: ${numberWithCommas(loan.amountWithInterest)}</span>
            <span className="me-2">Balance: ${numberWithCommas(loan.balance)}</span>
            {loan.status === 'Approved' ? (
              <span className="text-success">Active</span>
            ) : loan.status === 'Paid' ? (
              <span className="text-primary">Paid</span>
            ): loan.status ==='Declined' ? (
              <span className="text-danger">Declined</span>
            ) : (
              <span className={loan.status === 'Pending' ? 'text-warning' : 'text-danger'}>
                {loan.status}
              </span>
            )}
          </div>
        </Accordion.Header>
        <Accordion.Header className="d-none d-lg-block">
          <div>
            <span className="me-3">Amount: ${numberWithCommas(loan.amountWithInterest)}</span>
            <span className="me-3">Balance: ${numberWithCommas(loan.balance)}</span>
            <span className="me-3">Loan Term: {loan.loanTerm} months</span>
            <span className="me-3">Loan Date: {formatDateMMddYYYY(new Date(loan.date))}</span>
            {loan.status === 'Approved' ? (
              <span className="text-success">Active</span>
            ) : loan.status === 'Paid' ? (
              <span className="text-primary">Paid</span>
            ): loan.status ==='Declined' ? (
              <span className="text-danger">Declined</span>
            ) : (
              <span className={loan.status === 'Pending' ? 'text-warning' : 'text-danger'}>
                {loan.status}
              </span>
            )}
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <ListGroup>
            {loan.status === 'Approved' || loan.status === 'Paid' ? (
              loan.paymentTransactions.map((paymentTransaction) => (
                <ListGroup.Item key={paymentTransaction._id}>
                  {paymentTransaction.status === 'Paid' ? (
                    <span className="text-success">●</span>
                  ) : (
                    <span className="text-danger">●</span>
                  )}
                  <span className="me-3">Due Date: {formatDateMMddYYYY(new Date(paymentTransaction.dueDate))}</span>
                  <span className="me-5">Amount: ${numberWithCommas(paymentTransaction.amount)}</span>
                  {paymentTransaction.status === 'Unpaid' && loan.status === 'Approved' ? (
                    <span>
                      <Link to={`/customers/${customer_id}/payment/${paymentTransaction._id}`} 
                          className="btn btn-outline-primary fw-medium">
                        Pay now
                      </Link>
                    </span>
                  ) : (
                    <span className="text-success">Paid</span>
                  )}
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No payment transactions available.</ListGroup.Item>
            )}
          </ListGroup>
        </Accordion.Body>
      </Accordion.Item>
      ))}
    </Accordion>
    )}
    {loanListData.totalPages > 1  && (
      <Pagination 
        onPageChange={handlePageChange}
        totalPages={loanListData.totalPages || 0}
        currentPage={pageNumber}/>
    )}
    <span>
      <Link to={userRole !== UserRole.CUSTOMER? `/customers`:'/'} className='btn btn-outline-dark fw-medium'>Back</Link>
    </span>
  </div>
);

}

export  default CustomerLoanPaymentsList;
