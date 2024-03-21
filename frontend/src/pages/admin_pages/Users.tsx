import { useQuery } from 'react-query';
import * as apiClient from '../../api-client';
import UsersList from '../../components/UsersList';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import UsersSearchBar from '../../components/UsersSearchBar';
import Pagination from '../../components/Pagination';


const Users =()=>
{
  const [searchString, setSearchString] = useState('');
  const [roleFilter, setRoleFilter] = useState('employee')
  const [page, setPage] = useState(1);

  const {data: usersListData, isLoading} = 
          useQuery(['fetchUsers', searchString,roleFilter,page], ()=> apiClient.fetchUsers(searchString, page, roleFilter));


  const handlePageChange = (page: number) => {
    setPage(page);
  }

  const handleSearch = (searchString: string, role: string) => {
    setRoleFilter(role)
    setSearchString(searchString);
    setPage(1);
  }

  
  return(
    <div className='row'>
      <h3 className='text-dark'>Users</h3>
      <div className="col my-2">
        <Link to='/users/add-employee' className="btn btn-outline-dark fw-medium btn-md">Add Employee</Link>
      </div>
      <div className="col-lg justify-content-end d-flex">
          <UsersSearchBar onSearch={handleSearch} />
      </div>

      
      <div className='col-12 text-center'>
        {isLoading && <h3 className="mt-2">Loading...</h3>}
        {!isLoading && (!usersListData || !usersListData.users.length) && 
        <h3 className="mt-2">No Customer Found...</h3>}
      </div>

      {!isLoading && usersListData && usersListData.users.length > 0 && (
        <>
          <UsersList  users={usersListData.users} />
          
          {usersListData.totalPages > 1 &&
          //only pagination when  there are more than one page of results
            <div className=" justify-content-center mt-3">
              <Pagination
                totalPages = {usersListData.totalPages}
                currentPage = {page}
                onPageChange = {handlePageChange}
              />
            </div>
          }
         
          <span>
            <Link className="btn btn-outline-dark fw-medium" to={'/'}>Back</Link>
          </span>
        </>
      )}

    </div>
  );
}


export default  Users;