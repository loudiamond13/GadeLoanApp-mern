
import{BrowserRouter as Router,Route,Routes} from "react-router-dom";
import './App.scss';
import Layout from "./layouts/Layout";
import Register from "./pages/register";
import SignIn from "./pages/shared_pages/SignIn";
import CustomerRegistration from "./pages/customer_pages/CustomerRegistration";
import { useAppContext } from "./contexts/AppContext";
import { UserRole } from "../../backend/src/utilities/constants";
import Customers from "./pages/employee_admin_pages/Customers";
import CustomerLoanPaymentsList from "./pages/shared_pages/CustomerLoanPaymentsList"
import EditCustomer from './pages/shared_pages/EditCustomer';
import EditUserProfile from "./pages/shared_pages/EditUserProfile";
import EmailVerification from "./pages/shared_pages/EmailVerification";
import ForgotPassword from "./pages/shared_pages/ForgotPassword";
import ResetPassword from "./pages/shared_pages/ResetPassword";
import Users from "./pages/admin_pages/Users";
import CreateEmployee from "./pages/admin_pages/CreateEmployee";
import Home from "./pages/shared_pages/Home";
import CreateCustomerLoan from "./pages/shared_pages/CreateCustomerLoan";
import CreatePayment from "./pages/shared_pages/CreatePayment";
import CustomerLoanList from "./pages/employee_admin_pages/CustomerLoanList";
import CustomerLoanRequests from "./pages/employee_admin_pages/CustomerLoanRequests";





function App() {
  //  const [count, setCount] = useState(0)
  const { userRole, isLoggedIn} = useAppContext();
  return (
    <Router>
      <Routes>

        {/* TEMPORARY ROUTE(FOR TESTING PORPUSES) */}
        <Route path="/register/admin"
        element={<Layout><Register/></Layout>}/>

        <Route path="/"   
        element={<Layout><Home/></Layout>}/>

        <Route path="/register" 
        element={<Layout><CustomerRegistration/></Layout>}/>

        <Route path="/sign-in" 
        element={<Layout><SignIn/></Layout>}/>
        <Route path="/forgot-password"
        element={<Layout><ForgotPassword/></Layout>}
        />

        <Route path="/forgot-password/:user_id/verify/:token"
        element={<Layout><ResetPassword/></Layout>}/>

        <Route path="/users/:user_id/verify/:token"
        element={<Layout><EmailVerification/></Layout>}/>

        {isLoggedIn?
        (
          <>
            <Route path="/customers/:customer_id/payment/:paymentTransaction_id"
              element={<Layout><CreatePayment/></Layout>}/>
            <Route path="/customers/:customer_id/loan" 
              element={<Layout><CreateCustomerLoan/></Layout>}/>
            <Route path="/customers/:customer_id/loans" 
              element={<Layout><CustomerLoanPaymentsList/></Layout>}/>
            <Route path="/user-profile" 
              element={<Layout><EditUserProfile/></Layout>}/>
            <Route path="/resend-verification"/>

            <Route path="/customers/edit-customer/:customer_id"
            element={<Layout><EditCustomer/></Layout>}/>

            {/* Customer routes */}
            <Route path="/request-loan/:customer_id"
              element={<Layout><CreateCustomerLoan/></Layout>}/>
            
            <Route path="/loans" 
              element={<Layout><CustomerLoanPaymentsList/></Layout>}/>

            <Route path="/profile/edit/:customer_id"
            element={<Layout><EditCustomer/></Layout>}/>
          </>
        ):null}

        {userRole === UserRole.EMPLOYEE || userRole === UserRole.ADMIN ?(
        <>
          <Route path="/customers/:customer_id/loan/list" 
          element={<Layout><CustomerLoanList/></Layout>} />

         <Route path="/customers" 
          element={<Layout><Customers/></Layout>}/>

          <Route path="/loan-requests"
          element={<Layout><CustomerLoanRequests/></Layout>}/>
        
        </>) : null}
        {userRole === UserRole.ADMIN?  (
        <>

          <Route path="/users" 
          element={<Layout><Users/></Layout>}/>
            
          <Route path="users/add-employee" 
          element={<Layout><CreateEmployee/></Layout>}/>
        </>
        ):null}



        {/* <Route 
        path='*' 
        element= {<Navigate to="/" />}/> */}
      </Routes>
    </Router>
  );
}

export default App
