import { UserRole } from "../../../../backend/src/utilities/constants";
import AdminHomePage from "../../components/AdminHomePage";
import { useAppContext } from "../../contexts/AppContext";
import CustomerHomePage from "../../components/CustomerHomePage";
import EmployeeHomePage from "../../components/EmployeeHomePage";
import MainPage from "../../components/MainPage";




const Home =()=>
{
  const {userRole, isLoggedIn} = useAppContext();

  if(isLoggedIn && userRole === UserRole.CUSTOMER)
  {
    return(<CustomerHomePage/>);
  }

  else if(isLoggedIn && userRole === UserRole.ADMIN)
  {
    return(<AdminHomePage/>)
  }

  else if(isLoggedIn && userRole === UserRole.EMPLOYEE)
  {
    return(<EmployeeHomePage/>)
  }

  else
  {
    return(<MainPage/>)
  }

}

export default Home;