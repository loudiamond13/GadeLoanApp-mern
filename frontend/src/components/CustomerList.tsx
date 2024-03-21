
import { CustomerType } from "../../../backend/src/models/customerModel";
import { UserRole } from "../../../backend/src/utilities/constants";
import {BsFillEnvelopeFill, BsTelephoneFill,BsHouseDoorFill} from 'react-icons/bs';
import { Link } from "react-router-dom";
import Card from 'react-bootstrap/Card';


type Props =
{
  customerData?: CustomerType[];
  userRole: string;
}


const CustomerList =({userRole, customerData}:Props)=>
{

  //if there is no customer  data provided by the parent component, let the user know.
  if(customerData?.length === 0 || !customerData)
  {
    return <h3 className="text-center mt-2">No Customer Found...</h3>;  
  }else{

  return(
    <div className="container">
      <div className="text-black fs-5 col">
        {customerData.map((customer)=>
        (
          <Card className="mb-3 border border-dark border-1 shadow">
          <div className="row g-0">
            <div className="col-md-4 d-none d-md-block my-auto">
              <Card.Img className="img-fluid rounded customerImage img-thumbnail" 
                src={customer.imageUrl[0]} alt={`${customer.firstName} ${customer.lastName}`} />
            </div>
            <div className="col-md-8">
              <Card.Body>
                <Card.Title>{`${customer.firstName} ${customer.lastName}`}</Card.Title>
                <Card.Text><BsFillEnvelopeFill /> : {customer.email}</Card.Text>
                <Card.Text><BsTelephoneFill /> : {customer.phoneNumber}</Card.Text>
                <Card.Text><BsHouseDoorFill /> : 
                  {`${customer.streetAddress1}, ${customer.streetAddress2 ? `${customer.streetAddress2},` : ''} ${customer.city}, 
                    ${customer.state} ${customer.postalCode}`}
                </Card.Text>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <span className="">
                  <Link className="text-decoration-none btn btn-outline-dark btn-md fw-medium" 
                    to={`/customers/${customer._id}/loans`}> Make Payment
                  </Link>
                </span>
                <span className="">
                  <Link className="text-decoration-none btn btn-outline-dark btn-md fw-medium" 
                    to={`/customers/${customer._id}/loan`}> Make a Loan
                  </Link>
                </span>
                <span className="">
                  <Link className="text-decoration-none btn btn-outline-dark btn-md fw-medium"
                    to={`/customers/${customer._id}/loan/list`}>
                      View Loans
                  </Link>
                </span>
                {userRole === UserRole.ADMIN ? 
                  (
                    <span className="">
                      <Link className="text-decoration-none btn btn-outline-dark btn-md fw-medium" 
                        to={`/customers/edit-customer/${customer._id}`}> Edit Customer
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
    </div>
  );
}
}


export default CustomerList;