//  import { useState } from 'react'
//  import reactLogo from './assets/react.svg'
//  import viteLogo from '/vite.svg'
import{BrowserRouter as Router,Route,Routes,Navigate,} from "react-router-dom";
import './App.scss';
import Layout from "./layouts/Layout";
import Register from "./pages/register";
import SignIn from "./pages/SignIn";

function App() {
  //  const [count, setCount] = useState(0)

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
