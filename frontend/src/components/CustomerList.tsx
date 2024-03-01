import { useState } from "react";
import { CustomerType } from "../../../backend/src/models/customerModel";
import { UserRole } from "../../../backend/src/utilities/constants";
import CustomerSearchBar from "../components/CustomerSearchBar";
import {BsFillEnvelopeFill, BsRecordCircleFill, BsTelephoneFill,BsHouseDoorFill} from 'react-icons/bs';
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import Card from 'react-bootstrap/Card';


type Props =
{
  customerData?: CustomerType[];
  userRole: string;
}


const CustomerList =({userRole, customerData}:Props)=>
{

  const [currentPage, setCurrentPage] = useState(1);
  const [ITEMS_PER_PAGE] = useState(5);
  const [searchString, setSearchString] = useState("");
  const [branch, setBranch] = useState<string>('');

  //if there is no customer  data provided by the parent component, let the user know.
  if(!customerData)
  {
    return <h3 className="text-center mt-2">No Customer Found...</h3>;  
  }

   // Filter customer data based on search term
   const filteredCustomerData = customerData.filter((customer) =>
   (customer.firstName.toLowerCase().includes(searchString.toLowerCase()) ||
   customer.lastName.toLowerCase().includes(searchString.toLowerCase())) && 
   (branch === '' || customer.branch.toLowerCase() === branch.toLowerCase())
 );

  // Calculate index range for current page
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  const currentItems = filteredCustomerData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => 
  {
    setCurrentPage(page);
  };

  const handleSearch = (searchString: string, selectedBranch: string) => 
  {
    setSearchString(searchString);
    setBranch(selectedBranch);
    setCurrentPage(1); // Reset pagination to the first page when search term changes
  };




  return(
    <div className="row">
      <h3 className=" text-dark">Customers</h3>
      <div className="col-5  my-2">
        <Link to='/create-customer' className="btn btn-md btn-dark mb-2 fw-medium " >Add Customer</Link>
      </div>
      <div className="col-lg justify-content-end d-flex">
        <CustomerSearchBar onSearch={handleSearch}/>
      </div>

      {!filteredCustomerData.length ? (<h3 className="text-center mt-3">No customers found...</h3>):null}

      <div className="text-black fs-5 col-12">
        {currentItems.map((customer)=>
        (
          <Card className="mb-3 border border-dark border-1 shadow">
          <div className="row g-0">
            <div className="col-md-4 d-none d-md-block my-auto">
              <Card.Img className="img-fluid rounded customerImage img-thumbnail " src={customer.imageUrl[0]} alt={`${customer.firstName} ${customer.lastName}`} />
            </div>
            <div className="col-md-8">
              <Card.Body>
                <Card.Title>{`${customer.firstName} ${customer.lastName}`}</Card.Title>
                <Card.Text><BsFillEnvelopeFill /> : {customer.email}</Card.Text>
                <Card.Text><BsTelephoneFill /> : {customer.phoneNumber}</Card.Text>
                <Card.Text><BsRecordCircleFill /> : {`${customer.branch} Branch`}</Card.Text>
                <Card.Text><BsHouseDoorFill /> : {customer.streetAddress+", "+customer.barangay+", "+customer.cityMunicipality}</Card.Text>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <span className="">
                    <Link className="text-decoration-none btn btn-dark btn-md" 
                      to={`/payment/${customer._id}`}> Make Payment
                    </Link>
                    </span>
                  <span className="">
                    <Link className="text-decoration-none btn btn-dark btn-md"
                      to={`/edit-transactions/${customer._id}`}>
                        Edit Transactions
                    </Link>
                  </span>
                  {userRole === UserRole.ADMIN ? 
                    (
                      <span className="">
                        <Link className="text-decoration-none btn btn-dark btn-md" 
                          to={`/edit-customer/${customer._id}`}> Edit Customer
                        </Link>
                      </span>
                    ):null}
                </div>
              </Card.Body>
            </div>
          </div>
        </Card>
        ))}
      </div>
      <div className="col-12 d-flex justify-content-center mt-3">
       <Pagination
          totalPages={Math.ceil(filteredCustomerData.length / ITEMS_PER_PAGE)}
          currentPage={currentPage}
          onPageChange={handlePageChange}/> 
      </div>
    </div>
  );
}


export default CustomerList;