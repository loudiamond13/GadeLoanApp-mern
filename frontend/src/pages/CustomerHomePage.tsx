import { useQuery } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import * as apiContext from '../api-client';
import { Container, Row, Col, Card } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';
import CustomerDashboardLoanInformation from "../components/CustomerDashboardLoanInformation";

const CustomerHomePage =()=>
{

  const {user_id, userFirstName} = useAppContext();

  const {data: transactions} = useQuery("fetchCustomerTransactions", ()=> apiContext.fetchCustomerTransactions(user_id || ''));

  return(
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Welcome to Your Dashboard, {userFirstName}!</h2>
      <Row xs={1} md={2} className="g-4">
        <Col>
          <CustomerDashboardLoanInformation transactionsData={transactions}/>
        </Col>
        <Col>
          <Card className="h-100 rounded-3 shadow">
            <Card.Body>
              <Card.Title className="mb-3">Transactions</Card.Title>
              <Card.Text>
                View your recent transactions and track your financial activity.
              </Card.Text>
              <Link to="/transactions" className="btn btn-primary d-block">View Transactions</Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4 g-4">
        <Col xs={12} md={6}>
        <Card className="h-100 rounded-3 shadow">
            <Card.Body>
              <Card.Title className="mb-3">Request Loan</Card.Title>
              <Card.Text>
                Need extra funds? Request a new loan here.
              </Card.Text>
              <Link to="/request-loan" className="btn btn-primary d-block">Request Loan</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="rounded-3 shadow">
            <Card.Body>
              <Card.Title className="mb-3">Profile Settings</Card.Title>
              <ul className="list-unstyled">
                <li><Link to="/profile" className="text-decoration-none">View Profile</Link></li>
                <li><Link to="/profile/edit" className="text-decoration-none">Edit Profile</Link></li>
                <li><Link to="/change-password" className="text-decoration-none">Change Password</Link></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default CustomerHomePage;