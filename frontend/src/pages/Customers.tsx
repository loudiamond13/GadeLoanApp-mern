import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from '../api-client';
import {BsFillEnvelopeFill, BsRecordCircleFill, BsTelephoneFill,BsHouseDoorFill} from 'react-icons/bs';
import { useAppContext } from "../contexts/AppContext";
import { UserRole } from "../../../backend/src/utilities/constants";
const Customers = () => 
{
  const {data: customerData} = useQuery("fetchCustomers", apiClient.fetchCustomers, 
  {
    onError: ()=> {},
  });

  const {userRole} = useAppContext();

  if(!customerData)
  {
    return <span>No Customers</span>
  }
  return(
    <div className="row">
      <h2 className="text-center text-dark">Customers</h2>
      <div className="col-3  my-3">
        <Link to='/create-customer' className="btn btn-dark mb-3 fw-medium " >Add Customer</Link>
      </div>
    <div className="text-black fs-5 col-12">
      {customerData.map((customer)=>(
        <div className="border shadow border-dark border-2 bg-dark-subtle rounded  p-3 mb-3">
            <div className="bg-dark-subtle border-0 row">
             <div className="col-4 my-auto">
              <img className=" img-fluid rounded customerImage img-thumbnail " src={customer.imageUrl[0]} alt={customer.firstName+" image"} />
             </div>
             <div className="col-8">
             <p className="fw-medium">{customer.firstName +" "+ customer.lastName}</p>
              <p><BsFillEnvelopeFill /> : {customer.email}</p>
              <p><BsTelephoneFill /> : {customer.phoneNumber}</p>
              <p><BsRecordCircleFill /> : {customer.branch}</p>
              <p><BsHouseDoorFill /> : {customer.streetAddress+", "+customer.barangay+", "+customer.cityMunicipality}</p>
             </div>
             <div className="text-end"> 
                <span className="mx-2">
                  <Link className="text-decoration-none btn btn-dark" 
                    to={`/transactions/${customer._id}`}> Make a Payment/Loan
                  </Link></span>
                {userRole === UserRole.ADMIN ? 
                  (
                    <span className="mx-2">
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
    </div>
  );
};


export  default Customers;