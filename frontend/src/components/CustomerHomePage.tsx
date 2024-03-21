
import { useQuery } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import { Link } from 'react-router-dom';
import * as apiClient from '../api-client';
import ResendVerificationBtn from "./ResendEmailVerificationBtn";
import { BsFillEnvelopeFill } from "react-icons/bs";

const CustomerHomePage = () => {
  const {user_id, userFirstName } = useAppContext();

  const {data: currentUser} = useQuery('fetchCurrentUser', apiClient.fetchCurrentUser);

  if(!currentUser?.emailVerified)
  {
    return(
      <div>
        <h3 className="text-dark text-center">Please verify your email <BsFillEnvelopeFill /></h3>
        <h5 className="text-center"><ResendVerificationBtn/></h5>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-dark">WELCOME TO YOUR DASHBOARD, {userFirstName}!</h2>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100 rounded-3 shadow">
            <div className="card-body">
              <h5 className="card-title mb-3">Loan Information</h5>
              <p className="card-text">View information about your loans.</p>
              <Link to={`/customers/${user_id}/loans`} className="btn btn-primary d-block">View Loans</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100 rounded-3 shadow">
            <div className="card-body">
              <h5 className="card-title mb-3">Request Loan</h5>
              <p className="card-text">Need extra funds? Request a new loan here.</p>
              <Link to={`/request-loan/${user_id}`} className="btn btn-primary d-block">Request Loan</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card rounded-3 shadow">
            <div className="card-body">
              <h5 className="card-title mb-3">Profile Settings</h5>
              <ul className="list-unstyled">
                <li><Link to={`/profile/edit/${user_id}`} className="text-decoration-none">Edit Profile</Link></li>
                <li>
                  <Link to={`/user-profile`} className="text-decoration-none">
                    Change Email/Password
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerHomePage;
