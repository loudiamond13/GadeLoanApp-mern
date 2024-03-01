import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { TransactionsType } from "../../../backend/src/models/transactionModel";

type Props = 
{
  transactionsData?: TransactionsType;
}

const CustomerDashboardLoanInformation =({transactionsData}: Props)=>
{
  return(
    <Card className="h-100 rounded-3 shadow">
      <Card.Body>
        <Card.Title className="mb-3">Loan Information</Card.Title>
        <Card.Text>
          {transactionsData?.totalPayment}
          View information about your loans and manage your loan accounts.
        </Card.Text>
        <Link to="/loans" className="btn btn-primary d-block">View Loans</Link>
      </Card.Body>
    </Card>
  );
}

export default CustomerDashboardLoanInformation;