
import { useState } from "react";
import { useQuery } from "react-query";
import CustomerList from "../../components/CustomerList";
import * as apiClient from '../../api-client';
import { useAppContext } from "../../contexts/AppContext";
import Pagination from "../../components/Pagination";
import { Link} from "react-router-dom";
import SearchBar from "../../components/SearchBar";




const Customers = () => {
  
  const { userRole } = useAppContext();
  const [searchString, setSearchString] = useState('');
  const [pageNumber, setPageNumber] = useState(1); // Initialize page number state

  // Fetch customers based on search string, branch, and page number
  const { data: customerListData, isLoading } = useQuery(["fetchCustomers", searchString, pageNumber], 
                                () => apiClient.fetchCustomers(searchString, pageNumber), {
    onError: () => {},
  }); 

  const handlePageChange = (page: number) => {
    setPageNumber(page); // update the page number state when the page changes
  };

  const handleSearch = (searchString: string,) => {
    setSearchString(searchString);
    setPageNumber(1); // reset pagination to page 1 when search term or branch changes
  };

  return (
    <div className="row">
       <h3 className="col text-dark">Customers</h3>
      {/* <div className="col-5 my-2">
        <Link to='/customers/create-customer' className="btn btn-md btn-outline-dark mb-2 fw-medium">Add Customer</Link>
      </div> */}
      <div className="col-lg justify-content-end d-flex">
        <SearchBar onSearch={handleSearch}/>
      </div>

      <div className='col-12 text-center'>
        {isLoading && <h3 className="mt-2">Loading...</h3>}
        {!isLoading && (!customerListData || !customerListData.customers.length) && 
        <h3 className="mt-2">No Customer Found...</h3>}
      </div>

      {!isLoading && customerListData && customerListData.customers.length > 0 && (
        <>
          <CustomerList userRole={userRole} customerData={customerListData.customers} />

          {customerListData.totalPages > 1 &&  
          //only show the pagination when  there are more than one pages of results
            <div className=" justify-content-center mt-3">
              <Pagination
                totalPages = {customerListData.totalPages || 0}
                currentPage = {pageNumber}
                onPageChange = {handlePageChange}
              />
            </div>
          }
          <span>
            <Link className="btn btn-outline-dark fw-medium" to={"/"}>Back</Link>
          </span>
        </>
      )}
    </div>
  );
};

export default Customers;

