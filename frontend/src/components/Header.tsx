import { Link,NavLink } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import {UserRole} from '../../../backend/src/utilities/constants.ts';
import LogOutBtn from "./LogOutBtn.tsx";
import { useQuery } from "react-query";
import * as apiClient from '../api-client';
import { useEffect, useState } from "react";



const Header = () => {

  const {isLoggedIn, userRole} = useAppContext();
  const {data: currentUser} = useQuery('fetchCurrentUser', apiClient.fetchCurrentUser);
  const { data: loanRequestsCountData } = useQuery('getLoanRequestsCount', apiClient.getLoanRequestsCount);
  const [loanRequestsCount, setLoanRequestsCount] = useState(0);
  
  useEffect(()=>
  {
    if(userRole === UserRole.ADMIN || userRole === UserRole.EMPLOYEE)
    {
      const getLoanRequestsCount =()=>
      {
        setLoanRequestsCount(loanRequestsCountData)
      }
      getLoanRequestsCount();
    }
  },[userRole,loanRequestsCountData]);



  return(
    <nav className="navbar navbar-dark navbar-expand-lg bg-dark">
    <div className="container">
      <Link to="/" className="text-light navbar-brand fw-bold fs-3">LoanApp.com</Link>
    {/* <a className="navbar-brand  text-light fw-bold fs-3" href="/">LoanApp</a> */}
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon "></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarText">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {isLoggedIn &&
          (
            <li className="nav-item">
              <NavLink  to="/" className="nav-link">Home</NavLink> 
            </li>
          )
          }
          {userRole === UserRole.EMPLOYEE || userRole === UserRole.ADMIN && isLoggedIn? 
            (<>
              <li className="nav-item">
                <NavLink to='/customers' className="me-2 nav-link">Customers</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="me-2 nav-link position-relative" to="/loan-requests">
                  Loan Requests
                  {loanRequestsCount > 0 &&
                    <span className="position-absolute start-100 translate-middle badge rounded-pill bg-danger">
                      {loanRequestsCount}
                    </span>
                  }
                </NavLink>
              </li>
            </>):null
          }
          {userRole === UserRole.ADMIN && isLoggedIn?
            (<>
            <li className="nav-item">
               <NavLink className="me-2 nav-link"  to="/users">Users</NavLink>
            </li>
            </>):null
          }
        </ul>
        {!isLoggedIn ? 
        (
          <>
          <span className="navbar-item ">
             <NavLink className="me-5 my-3 text-light nav-link " to="/sign-in">Sign In</NavLink>
          </span>
          <span className="navbar-item ">
             <NavLink className="me-5 my-3  text-light nav-link" to="/register">Register</NavLink>
           </span>
           <span className="navbar-item ">
             <NavLink className="me-5 my-3  text-light nav-link" to="/register/admin">Register as Admin</NavLink>
           </span>
          </>
        ):(
        <>
          <span className="navbar-item">
            <NavLink className="me-5 my-3 nav-link text-light" to={`/user-profile`}>
             {`  Hello, ${currentUser?.role} ${currentUser?.firstName} ${currentUser?.lastName}`}
            </NavLink>  
          </span>
          <span className="navbar-item">
            <LogOutBtn/>
          </span>
        </>
        )}
      
      </div>
      
    </div>
  </nav>
  );

};

export default Header;