import { UserRole } from "../../../backend/src/utilities/constants";
import { useAppContext } from "../contexts/AppContext";
import CustomerHomePage from "./customer_pages/CustomerHomePage";




const Home =()=>
{
  const {userRole} = useAppContext();

 if(userRole === UserRole.CUSTOMER)
 {
  return(<CustomerHomePage/>);
 }

 if(userRole === UserRole.ADMIN)
 {
  return(<>admin</>)
 }

}

export default Home;