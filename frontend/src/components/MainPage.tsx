import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <div className="container mt-5 text-dark">
      <h1 className="text-center mb-4">Loan Management System Overview</h1>
      <div className="row">
        <div className="col-md-6">
          <h2>Customer Features:</h2>
          <ul>
            <li>Register for an account</li>
            <li>Update profile details (email, password)</li>
            <li>Forgot password functionality (using Nodemailer)</li>
            <li>Email verification</li>
            <li>Request a loan</li>
            <li>Pay loan</li>
          </ul>
          <p className="text-center">
            <Link to="/sign-in" className="btn btn-primary">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-secondary ms-2">
              Register
            </Link>
          </p>
        </div>
        <div className="col-md-6">
          <h2>Admin Features:</h2>
          <ul>
            <li>Manage users (lock/unlock, delete)</li>
            <li>Approve/decline loan requests</li>
            <li>Make loan/payment for the customer</li>
            <li>Edit customer details</li>
          </ul>
          <p className="text-center">
            <Link to="/register/admin" className="btn btn-primary">
              Register as an Admin
            </Link>
          </p>
        </div>
      </div>
      <div className="mt-5">
        <h2 className="text-center">Tools Used:</h2>
        <div className="row">
          <div className="col-md-6">
            <h3>Frontend:</h3>
            <ul>
              <li>HTML</li>
              <li>CSS</li>
              <li>JavaScript</li>
              <li>React.js</li>
              <li>Bootstrap</li>
            </ul>
          </div>
          <div className="col-md-6">
            <h3>Backend:</h3>
            <ul>
              <li>Node.js</li>
              <li>Express.js</li>
              <li>MongoDB</li>
              <li>Express-Validator</li>
            </ul>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6">
            <h3>Authentication:</h3>
            <ul>
              <li>JSON Web Tokens (JWT)</li>
              <li>bcrypt</li>
              <li>Cookie (for session management)</li>
            </ul>
          </div>
          <div className="col-md-6">
            <h3>Email Verification/Resetting Password:</h3>
            <ul>
              <li>Nodemailer</li>
            </ul>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6">
            <h3>Payment Integration:</h3>
            <ul>
              <li>Stripe API</li>
            </ul>
          </div>
          <div className="col-md-6">
            <h3>Deployment:</h3>
            <ul>
              <li>Render.com</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <h2 className="text-center">Testing:</h2>
        <p className="text-center">End-to-end testing</p>
      </div>
      <div className="mt-5">
        <h2 className="text-center">Source Code:</h2>
        <p className="text-center">
          <a
            href="https://github.com/loudiamond13/LoanApp-MERN"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            View Source Code
          </a>
        </p>
      </div>
    </div>
  );
};

export default MainPage;
