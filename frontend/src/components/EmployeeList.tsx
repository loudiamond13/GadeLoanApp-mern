
import { UserType } from "../../../backend/src/models/userModel";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { Link } from "react-router-dom";
import * as apiClient from '../api-client';
import { useAppContext } from "../contexts/AppContext";
import { useQueryClient } from "react-query";
import { useState } from "react";
import EmployeeSearchBar from "./EmployeeSearchBar";
import Pagination from "./Pagination";
import { Table } from 'react-bootstrap'; 



type Props =
{
  employees?: UserType[];
}


const EmployeeList =({employees}: Props)=>
{
  const queryClient = useQueryClient();
  const {showToast} = useAppContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [ITEMS_PER_PAGE] = useState(5);
  const [searchString, setSearchString] = useState('');

  //check if there is employee passed in 
  if(!employees)
  {
    return <h1>No Employee Found...</h1>
  }

   // Filter customer data based on search string
  const filteredEmployeeData = employees.filter((employees: UserType)=> (
                              (employees.firstName.toLowerCase().includes(searchString.toLowerCase())) ||
                              (employees.lastName.toLowerCase().includes(searchString.toLowerCase())) ||
                              (employees.email.toLowerCase().includes(searchString.toLowerCase()))
                              ));
                              
  // Calculate index range for current page
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredEmployeeData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) =>
  {
    setCurrentPage(page);
  }

  const handleSearch = (searchString: string) =>
  {
    setSearchString(searchString);
    setCurrentPage(1);
  }

  const handleDeleteEmployee = async (employee_id: string) => {
    try {
      await apiClient.deleteUserByID(employee_id);
      queryClient.invalidateQueries('fetchEmployees');
      showToast({message: 'Employee Deleted Successfully.', type:'success'});
    } catch (error) {
      showToast({message: `Error on deleteing employee.`, type:'error'});
    }
  };

  const handleLockEmployee = async (employee_id: string, isLocked: boolean) => {
    try {
      // Call the API endpoint to lock or unlock the employee based on the current lock status
      await apiClient.lockUserByID(employee_id, isLocked);
      queryClient.invalidateQueries('fetchEmployees');
      const action = isLocked ? 'unlocked' : 'locked';
      showToast({ message: `Employee ${action} Successfully.`, type: 'success' });
    } catch (error) {
      showToast({ message: `Error on ${isLocked ? 'unlocking' : 'locking'} employee account.`, type: 'error' });
    }
  };

  return(
  <>
  {employees.length?? 0 > 1 ?
  (
    <div className="row">
      <h3 className=" text-dark">Employees</h3>
      <div className="col my-2">
        <Link to='/add-employee' className="btn btn-dark fw-medium btn-md" >Add Employee</Link>
      </div>
      <div className="col-lg justify-content-end d-flex">
        <EmployeeSearchBar onSearch={handleSearch} />
      </div>
      <div>
        <Table striped hover bordered className=" col-lg-3 shadow">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {currentItems.map((employee)=>
          (
            <tr key={employee._id} className="col">
              <td>{`${employee.firstName}  ${employee.lastName}`}</td>
              <td>{employee.email}</td>
              <td>
                <button className={`btn btn-md m-1  ${employee.isLocked ? 'btn-warning' : 'btn-primary'}`}
                  onClick={() => handleLockEmployee(employee._id, employee.isLocked)}>
                  {employee.isLocked ? 'Unlock' : 'Lock'}
                </button>

                <DeleteConfirmationModal 
                  title= {'Delete Employee'}
                  text={`Are you sure you want to delete employee ${employee.firstName}?`}
                  onDelete={() => handleDeleteEmployee(employee._id)}/>
              </td>
            </tr>
          ))}
          </tbody>
        </Table>
         <Pagination 
              totalPages={Math.ceil(filteredEmployeeData.length / ITEMS_PER_PAGE)}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              />
      </div>
    </div>
  ):(<><span>No Employees</span></>)
  }
  </>
  );
}

export default EmployeeList;