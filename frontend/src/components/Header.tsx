import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import {UserRole} from '../../../backend/src/utilities/constants.ts';
import LogOutBtn from "./LogOutBtn.tsx";


const Header = () => {

  const {isLoggedIn, userRole, user_id, userFirstName, userLastName} = useAppContext();

  


  return(
    <nav className="navbar navbar-dark navbar-expand-lg bg-dark">
    <div className="container">
      <Link to="/" className="text-light navbar-brand fw-bold fs-3">GadeLLC.com</Link>
    {/* <a className="navbar-brand  text-light fw-bold fs-3" href="/">LoanApp</a> */}
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon "></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarText">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link to="/" className="text-light nav-link" >Home</Link>
          </li>
          {
            userRole === UserRole.EMPLOYEE || userRole === UserRole.ADMIN && isLoggedIn? 
            (<>
              <li className="nav-item">
              <Link to='/customers' className="me-2  text-light nav-link">Customers</Link>
              </li>
              {/* <li className="nav-item">
               <Link to='create-customer' className="me-2  text-light nav-link">Create Customer</Link>
              </li> */}
            </>)
            :null
          }
          {
            userRole === UserRole.ADMIN && isLoggedIn?
            (<>
            <li className="nav-item">
               <Link className="me-2  text-light nav-link"  to="/register ">Create Employee</Link>
            </li>
            </>):null
          }
        </ul>
        {!isLoggedIn ? 
        (
          <>
          <span className="navbar-item ">
          
             <Link className="me-5 my-3 text-light nav-link " to="/sign-in">Sign In</Link>
           
          </span>
           <span className="navbar-item ">
           
             <Link className="me-5 my-3  text-light nav-link" to="/register">Register</Link>
       
           </span>
          </>
        ):(
        <>
          <span className="navbar-item">
            <Link className="me-5 my-3  text-light nav-link" to={`/user-profile/${user_id}`}>
             {`  Hello, ${userRole} ${userFirstName} ${userLastName}`}
            </Link>  
          </span>
          <span className="navbar-item">
            <LogOutBtn/>
          </span>
        </>
        )};
      
      </div>
      
    </div>
  </nav>
  );

};

export default Header;