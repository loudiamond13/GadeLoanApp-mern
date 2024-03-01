import { UserRole } from "../../../backend/src/utilities/constants";
import { useAppContext } from "../contexts/AppContext";
import CustomerHomePage from "./CustomerHomePage";




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