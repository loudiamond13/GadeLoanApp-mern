import { useQuery } from "react-query";
import * as apiClient from '../api-client';
import ResendVerificationBtn from "./ResendEmailVerificationBtn";
import { useAppContext } from "../contexts/AppContext";
import { UserRole } from "../../../backend/src/utilities/constants";

const Hero = () => {
  const {isLoggedIn, userRole} = useAppContext();
  const {data:currentUser} = useQuery('fetchCurrentUser', apiClient.fetchCurrentUser);
  return(
    <div className="bg-dark pb-16">
      <div className="container mx-auto ">
         <p className=" fs-5 text-light fst-italic">We got your back when you are in need of help, financially...</p> 
         {isLoggedIn && !currentUser?.emailVerified && userRole !== UserRole.CUSTOMER && 
          <p className="text-info text-center">Please verify your email. <ResendVerificationBtn/></p>
         }
      </div>
    </div>
  );
};


export default Hero;