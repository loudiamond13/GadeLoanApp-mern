import { UserType } from "../../../backend/src/models/userModel";
import DeleteBtnWithConfirmationModal from "./DeleteBtnWithConfirmationModal";
import * as apiClient from '../api-client';
import { useAppContext } from "../contexts/AppContext";
import { useQueryClient } from "react-query";


type Props = {
  users?: UserType[];
}

const UsersList = ({ users }: Props) => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();


  const handleDeleteEmployee = async (users: string) => {
    try {
      await apiClient.deleteUserByID(users);
      queryClient.invalidateQueries('fetchUsers');
      showToast({ message: 'User Deleted Successfully.', type: 'success' });
    } catch (error) {
      showToast({ message: `Error on deleteing a user.`, type: 'error' });
    }
  };

  const handleLockEmployee = async (users: string, isLocked: boolean) => {
    try {
      await apiClient.lockUserByID(users, isLocked);
      queryClient.invalidateQueries('fetchUsers');
      const action = isLocked ? 'unlocked' : 'locked';
      showToast({ message: `User ${action} Successfully.`, type: 'success' });
    } catch (error) {
      showToast({ message: `Error on ${isLocked ? 'unlocking' : 'locking'} user account.`, type: 'error' });
    }
  };

  return (
    <>
      {users && users.length > 0 ? (
        <div className="table-responsive">
           <table className="table table-bordered table-hover shadow table-responsive">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user._id} className="col">
                  <td>{`${user.firstName}  ${user.lastName}`}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className="text-center">
                    <button className={`btn btn-md m-1  ${user.isLocked ? 'btn-outline-warning' : 'btn-outline-primary'}`}
                      onClick={() => handleLockEmployee(user._id, user.isLocked)}>
                      {user.isLocked ? 'Unlock' : 'Lock'}
                    </button>
                    <DeleteBtnWithConfirmationModal
                      title={'Delete User'}
                      text={`Are you sure you want to delete user ${user.firstName}?`}
                      onDelete={() => handleDeleteEmployee(user._id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="my-3">
          <h3 className="text-dark text-center">No Users Found...</h3>
        </div>
      )}
    </>
  );
};

export default UsersList;
