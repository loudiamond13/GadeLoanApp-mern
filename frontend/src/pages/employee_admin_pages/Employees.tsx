import { useQuery } from 'react-query';
import * as apiClient from '../../api-client';
import EmployeeList from '../../components/EmployeeList';


const Employees =()=>
{

  const {data: employees} = useQuery('fetchEmployees', apiClient.fetchEmployees);

  return(
    <EmployeeList  employees={employees}/>
  );
}


export default  Employees;