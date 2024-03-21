import { Link } from 'react-router-dom';
import { useAppContext } from "../contexts/AppContext";

const EmployeeHomePage = () => {
  const { userFirstName } = useAppContext();

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-dark">WELCOME TO YOUR DASHBOARD, {userFirstName}!</h2>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100 rounded-3 shadow">
            <div className="card-body">
              <h5 className="card-title mb-3">Manage Loan Requests</h5>
              <p className="card-text">View and manage loan applications.</p>
              <Link to="/loan-requests" className="btn btn-primary d-block mt-4">Manage Loan Requests</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100 rounded-3 shadow">
            <div className="card-body">
              <h5 className="card-title mb-3">Manage Customers</h5>
              <p className="card-text">Make Payment/Loan, View, edit, or delete customer accounts.</p>
              <Link to="/customers" className="btn btn-primary d-block">Manage Customers</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6 mb-4">
          <div className="card h-100 rounded-3 shadow">
            <div className="card-body">
              <h5 className="card-title mb-3">Edit Profile</h5>
              <p className="card-text">Update your employee profile information.</p>
              <Link to="/user-profile" className="btn btn-primary d-block">Edit Profile</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeHomePage;
