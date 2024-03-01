import { useState } from "react";
import { CustomerType } from "../../../backend/src/models/customerModel";
import { UserRole } from "../../../backend/src/utilities/constants";
import CustomerSearchBar from "../components/CustomerSearchBar";
import {BsFillEnvelopeFill, BsRecordCircleFill, BsTelephoneFill,BsHouseDoorFill} from 'react-icons/bs';
import { Link } from "react-router-dom";
import Pagination from "./Pagination";


type Props =
{
  customerData?: CustomerType[];
  userRole: string;
}


const CustomerList =({userRole, customerData}:Props)=>
{

  const [currentPage, setCurrentPage] = useState(1);
  const [ITEMS_PER_PAGE] = useState(5);
  const [searchString, setSearchTerm] = useState("");
  const [branch, setBranch] = useState<string>('');


  // Calculate index range for current page
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  // Filter customer data based on search term
  const filteredCustomerData = customerData?.filter((customer) =>
    (customer.firstName.toLowerCase().includes(searchString.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchString.toLowerCase())) && 
    (branch === '' || customer.branch.toLowerCase() === branch.toLowerCase())
  );

  const currentItems = filteredCustomerData?.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (searchString: string, selectedBranch: string) => {
    setSearchTerm(searchString);
    setBranch(selectedBranch);
    setCurrentPage(1); // Reset pagination to the first page when search term changes
  };



  return(
    <div className="row">
      <h2 className="text-center text-dark">Customers</h2>
      <div className="col-4  my-3">
        <Link to='/create-customer' className="btn btn-dark mb-3 fw-medium " >Add Customer</Link>
      </div>
      <div className="col-lg justify-content-end d-flex me-0 text-end">
        <CustomerSearchBar onSearch={handleSearch} />
      </div>
     
    <div className="text-black fs-5 col-12">
      
      {currentItems?.map((customer)=>(
        <div className="border shadow border-dark border-2 bg-dark-subtle rounded  p-3 mb-3">
            <div className="bg-dark-subtle border-0 row">
             <div className="col-4 my-auto">
              <img className=" img-fluid rounded customerImage img-thumbnail " src={customer.imageUrl[0]} alt={customer.firstName+" image"} />
             </div>
             <div className="col-8">
             <p className="fw-medium">{customer.firstName +" "+ customer.lastName}</p>
              <p className="customer-email"><BsFillEnvelopeFill /> : {customer.email}</p>
              <p><BsTelephoneFill /> : {customer.phoneNumber}</p>
              <p><BsRecordCircleFill /> : {customer.branch}</p>
              <p><BsHouseDoorFill /> : {customer.streetAddress+", "+customer.barangay+", "+customer.cityMunicipality}</p>
             </div>
             <div className="text-end"> 
                <span className="">
                  <Link className="text-decoration-none btn btn-dark" 
                    to={`/transactions/${customer._id}`}> Make a Payment/Loan
                  </Link>
                 <span className="mx-2">
                  <Link className="text-decoration-none btn btn-dark"
                    to={`/edit-transactions/${customer._id}`}>
                      Edit Transactions
                  </Link>
                 </span>
                </span>
                {userRole === UserRole.ADMIN ? 
                  (
                    <span className="">
                      <Link className="text-decoration-none btn btn-dark" 
                        to={`/edit-customer/${customer._id}`}> Edit Customer
                      </Link>
                    </span>
                  ):null
                }
             </div>
            </div>
        </div>
      ))}
    </div>
    <div className="col-12 d-flex justify-content-center mt-3">
       <Pagination
          totalPages={Math.ceil(filteredCustomerData?.length / ITEMS_PER_PAGE)}
          currentPage={currentPage}
          onPageChange={handlePageChange}/>
          
      </div>
    </div>
  );
}


export default CustomerList;