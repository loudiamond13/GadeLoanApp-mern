//  import { useState } from 'react'
//  import reactLogo from './assets/react.svg'
//  import viteLogo from '/vite.svg'
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

        <Route path="/users/:user_id/verify/:token"
          element={<Layout><EmailVerification/></Layout>}/>
        
        <Route path='/search'
        element={<Layout>
          <p>Search Page</p>
        </Layout>
        }/>

        <Route path="/register"
        element={<Layout><Register/></Layout>}/>

        <Route path="/sign-in" 
        element={<Layout><SignIn/></Layout>}/>

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
         <Route path="/customers" 
          element={<Layout><Customers/></Layout>}/>

          <Route path="/create-customer" 
          element={<Layout><CreateCustomer/></Layout>}/>

          <Route path="/transactions/:customer_id" 
          element={<Layout><CreateCustomerTransaction/></Layout>}/>

          <Route path="/edit-customer/:customer_id"
          element={<Layout><EditCustomer/></Layout>}/>
        
        </>) : null}
        {/* <Route 
        path='*' 
        element= {<Navigate to="/" />}/> */}
      </Routes>
    </Router>
  );
}

export default App
