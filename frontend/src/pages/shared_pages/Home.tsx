import { UserRole } from "../../../../backend/src/utilities/constants";
import AdminHomePage from "../../components/AdminHomePage";
import { useAppContext } from "../../contexts/AppContext";
import CustomerHomePage from "../../components/CustomerHomePage";
import EmployeeHomePage from "../../components/EmployeeHomePage";




const Home =()=>
{
  const {userRole} = useAppContext();

  if(userRole === UserRole.CUSTOMER)
  {
    return(<CustomerHomePage/>);
  }

  if(userRole === UserRole.ADMIN)
  {
    return(<AdminHomePage/>)
  }

  if(userRole === UserRole.EMPLOYEE)
  {
    return(<EmployeeHomePage/>)
  }

}

export default Home;