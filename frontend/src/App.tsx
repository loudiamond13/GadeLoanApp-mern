
import{BrowserRouter as Router,Route,Routes} from "react-router-dom";
import './App.scss';
import Layout from "./layouts/Layout";
import Register from "./pages/register";
import SignIn from "./pages/shared_pages/SignIn";
import CreateCustomer from "./pages/employee_admin_pages/CreateCustomer";
import { useAppContext } from "./contexts/AppContext";
import { UserRole } from "../../backend/src/utilities/constants";
import Customers from "./pages/employee_admin_pages/Customers";
import CreateCustomerPayment from "./pages/shared_pages/CreateCustomerPayment"
import EditCustomer from './pages/shared_pages/EditCustomer';
import EditUserProfile from "./pages/shared_pages/EditUserProfile";
import EmailVerification from "./components/EmailVerification";
import ForgotPassword from "./pages/shared_pages/ForgotPassword";
import ResetPassword from "./pages/shared_pages/ResetPassword";
import EditCustomerTransaction from "./pages/employee_admin_pages/EditCustomerTransaction";
import Employees from "./pages/employee_admin_pages/Employees";
import CreateEmployee from "./pages/employee_admin_pages/CreateEmployee";
import Home from "./pages/shared_pages/Home";
import CreateCustomerLoan from "./pages/shared_pages/CreateCustomerLoan";




function App() {
  //  const [count, setCount] = useState(0)
  const { userRole, isLoggedIn} = useAppContext();
  return (
    <Router>
      <Routes>

        <Route path="/"   
        element={<Layout><Home/></Layout>}/>

        <Route path="/register"
        element={<Layout><Register/></Layout>}/>

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
            <Route path="/loan/:customer_id" 
              element={<Layout><CreateCustomerLoan/></Layout>}/>
            <Route path="/payment/:customer_id" 
              element={<Layout><CreateCustomerPayment/></Layout>}/>
            <Route path="/user-profile/:user_id" 
              element={<Layout><EditUserProfile/></Layout>}/>
            <Route path="/resend-verification/:user_id"/>
          </>
        ):null}

        {userRole === UserRole.EMPLOYEE || userRole === UserRole.ADMIN ?(
        <>
        <Route path="/edit-transactions/:customer_id"
          element={<Layout><EditCustomerTransaction/></Layout>} />
         <Route path="/customers" 
          element={<Layout><Customers/></Layout>}/>

          <Route path="/create-customer" 
          element={<Layout><CreateCustomer/></Layout>}/>

          <Route path="/edit-customer/:customer_id"
          element={<Layout><EditCustomer/></Layout>}/>
        
        </>) : null}
        {userRole === UserRole.ADMIN?  (
        <>
          <Route path="/employees" 
          element={<Layout><Employees/></Layout>}/>
            
          <Route path="/add-employee" 
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
