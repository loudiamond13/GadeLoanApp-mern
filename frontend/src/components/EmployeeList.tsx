
import { UserType } from "../../../backend/src/models/userModel";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { Link } from "react-router-dom";
import * as apiClient from '../api-client';
import { useAppContext } from "../contexts/AppContext";
import { useQueryClient } from "react-query";




type Props =
{
  employees?: UserType[];
}


const EmployeeList =({employees}: Props)=>
{
  const queryClient = useQueryClient();
  const {showToast} = useAppContext();

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
  {employees?.length?? 0 > 1 ?
  (
    <div>
      <h3 className="mt-3">Employees</h3>
      <span>
      <div className="col my-3">
        <Link to='/add-employee' className="btn btn-dark mb-3 fw-medium " >Add Employee</Link>
      </div>
      </span>
      <div>
        <table className="table table-striped mt-2 col-lg-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {employees?.map((employee)=>
          (
            <tr key={employee._id} className="col">
              <td>{`${employee.firstName}  ${employee.lastName}`}</td>
              <td>{employee.email}</td>
              <td>
                <button className={`btn me-2 ${employee.isLocked ? 'btn-warning' : 'btn-primary'}`}
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
        </table>
         {/* Delete confirmation modal */}
         
      </div>
    </div>
  ):(<><span>No Employees</span></>)
  }
  </>
  );
}

export default EmployeeList;