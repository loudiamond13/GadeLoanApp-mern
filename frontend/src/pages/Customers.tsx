import { useQuery } from "react-query";
// import { Link } from "react-router-dom";
import * as apiClient from '../api-client';
// import {BsFillEnvelopeFill, BsRecordCircleFill, BsTelephoneFill,BsHouseDoorFill} from 'react-icons/bs';
import { useAppContext } from "../contexts/AppContext";
// import { UserRole } from "../../../backend/src/utilities/constants";
// import CustomerSearchBar from "../components/CustomerSearchBar";
import CustomerList from "../components/CustomerList";
const Customers = () => 
{
  const {data: customerData} = useQuery("fetchCustomers", apiClient.fetchCustomers, 
  {
    onError: ()=> {},
  });

  const {userRole} = useAppContext();

  
  return(
    <CustomerList userRole={userRole} customerData={customerData}/>
  );
};


export  default Customers;