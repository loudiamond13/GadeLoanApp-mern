
import{BrowserRouter as Router,Route,Routes} from "react-router-dom";
import './App.scss';
import Layout from "./layouts/Layout";
import Register from "./pages/register";
import SignIn from "./pages/SignIn";
import CreateCustomer from "./pages/CreateCustomer";
import { useAppContext } from "./contexts/AppContext";
import { UserRole } from "../../backend/src/utilities/constants";
import Customers from "./pages/Customers";
import CreateCustomerTransaction from "./pages/CreateCustomerTransaction";
import EditCustomer from './pages/EditCustomer';
import EditUserProfile from "./pages/EditUserProfile";
import EmailVerification from "./components/EmailVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EditCustomerTransaction from "./pages/EditCustomerTransaction";
import Employees from "./pages/Employees";
import CreateEmployee from "./pages/CreateEmployee";



function App() {
  //  const [count, setCount] = useState(0)
  const { userRole, isLoggedIn} = useAppContext();
  return (
    <Router>
      <Routes>

        <Route path="/"   
        element={
        <Layout>
          <p>Home Page</p>
        </Layout>
        }/>

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

          <Route path="/transactions/:customer_id" 
          element={<Layout><CreateCustomerTransaction/></Layout>}/>

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
