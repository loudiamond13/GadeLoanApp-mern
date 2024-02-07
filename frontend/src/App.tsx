//  import { useState } from 'react'
//  import reactLogo from './assets/react.svg'
//  import viteLogo from '/vite.svg'
import{BrowserRouter as Router,Route,Routes,Navigate,} from "react-router-dom";
import './App.scss';
import Layout from "./layouts/Layout";

import SignIn from "./pages/SignIn";
import CreateCustomer from "./pages/CreateCustomer";
import { useAppContext } from "./contexts/AppContext";
import Register from "./pages/register";

function App() {
  //  const [count, setCount] = useState(0)
  const {isLoggedIn} = useAppContext();
  return (
    <Router>
      <Routes>
        <Route 
        path="/" 
        element={
        <Layout>
          <p>Home Page</p>
        </Layout>
        }/>
        <Route 
        path='/search'
        element={<Layout>
          <p>Search Page</p>
        </Layout>
        }/>
        <Route
        path="/register"
        element={<Layout><Register/></Layout>}
        />
        <Route 
        path="/sign-in" 
        element={<Layout><SignIn/></Layout>}/>

        {isLoggedIn && 
        <>
          <Route path="/create-customer" 
          element={<Layout><CreateCustomer/></Layout>}/>
        </>}
        <Route 
        path='*' 
        element= {<Navigate to="/" />}/>
      </Routes>
    </Router>
    // <>
    //   <h1 className='text-center text-secondary bg-dark'>React + Vite</h1>
    // </>
  );
}

export default App
