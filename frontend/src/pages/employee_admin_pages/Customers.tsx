// import { useQuery } from "react-query";
// // import { Link } from "react-router-dom";
// import * as apiClient from '../../api-client';
// // import {BsFillEnvelopeFill, BsRecordCircleFill, BsTelephoneFill,BsHouseDoorFill} from 'react-icons/bs';
// import { useAppContext } from "../../contexts/AppContext";
// // import { UserRole } from "../../../backend/src/utilities/constants";
// // import CustomerSearchBar from "../components/CustomerSearchBar";
// import CustomerList from "../../components/CustomerList";
// const Customers = () => 
// {
//   const {data: customerData} = useQuery("fetchCustomers", apiClient.fetchCustomers, 
//   {
//     onError: ()=> {},
//   });

//   const {userRole} = useAppContext();

  
//   return(
//     <CustomerList userRole={userRole} customerData={customerData}/>
//   );
// };


// export  default Customers;


import { useState } from "react";
import { useQuery } from "react-query";
import CustomerList from "../../components/CustomerList";
import * as apiClient from '../../api-client';
import { useAppContext } from "../../contexts/AppContext";
import Pagination from "../../components/Pagination";
import CustomerSearchBar from "../../components/CustomerSearchBar";
import { Link } from "react-router-dom";

const Customers = () => {
  const {userRole} = useAppContext();
  const [searchString, setSearchString] = useState('');
  const [branch, setBranch] = useState<string>('');
  const [pageNumber, setPageNumber] = useState(1); // Initialize page number state

  // Fetch customers based on search string, branch, and page number
  const {data: customerListData, isLoading } = useQuery(["fetchCustomers", searchString, branch, pageNumber], 
                                () => apiClient.fetchCustomers(searchString, branch, pageNumber), {
    onError: () => {},
  });


  const handlePageChange = (page: number) => {
    setPageNumber(page); // Update the page number state when the page changes
  };

  const handleSearch = (searchString: string, selectedBranch: string) => {
    setSearchString(searchString);
    setBranch(selectedBranch);
    setPageNumber(1); // Reset pagination to page 1 when search term or branch changes
  };
  

  if(!customerListData)
  {
    return <h3 className="text-center mt-2">No Customer Found...</h3>;  
  }

  if(isLoading)
  {
    return <h3 className="text-center mt-2">Loading...</h3>;  
  }

  return (
    <div className="row">
       <h3 className=" text-dark">Customers</h3>
      <div className="col-5  my-2">
        <Link to='/create-customer' className="btn btn-md btn-dark mb-2 fw-medium " >Add Customer</Link>
      </div>
      <div className="col-lg justify-content-end d-flex">
        <CustomerSearchBar onSearch={handleSearch}/>
      </div>

      <CustomerList userRole={userRole} customerData={customerListData.customers} />

      <div className="col-12 d-flex justify-content-center mt-3">
        <Pagination
          totalPages={customerListData.totalPages || 0}
          currentPage={pageNumber}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Customers;
