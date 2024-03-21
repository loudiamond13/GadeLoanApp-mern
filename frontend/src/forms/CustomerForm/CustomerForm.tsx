import { FormProvider, useForm } from "react-hook-form";
import CustomerDetailsSection from "./CustomerDetailsSection";
import CustomerImageSection from "./CustomerImageSection";
import { CustomerType } from "../../../../backend/src/models/customerModel";
import { useEffect } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { UserRole } from "../../../../backend/src/utilities/constants";
import { useQueryClient } from "react-query";
import * as apiClient from '../../api-client';
import DeleteBtnWithConfirmationModal from "../../components/DeleteBtnWithConfirmationModal";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";



export type CustomerFormData = 
{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  state: string;
  postalCode: string;
  dob: Date;
  age: number;
  phoneNumber:string;
  gender: string;
  imageFile: File[];
  imageUrl:string[];
  
};

type Props = 
{
  customer?: CustomerType;
  onCreate:(customerFormData:FormData) => void;
  isLoading: boolean;
}



const CustomerForm =({onCreate,isLoading,customer}: Props) =>
{
  const navigate = useNavigate();
  const {userRole, showToast} = useAppContext();
  const queryClient = useQueryClient();
  const  formMethods = useForm<CustomerFormData>();
  const {handleSubmit,reset} = formMethods;



  const handleDeleteEmployee = async (customer_id: string) => {
    try {
      await apiClient.deleteUserByID(customer_id);
      queryClient.invalidateQueries('fetchCustomers');
      showToast({message: 'Customer Deleted Successfully.', type:'success'});
      navigate('/customers')
    } catch (error) {
      showToast({message: `Error on deleteing customer.`, type:'error'});
    }
  };

useEffect(()=>
{
  reset(customer);
},[customer,reset]);


  const onSubmit = handleSubmit((formDataJson: CustomerFormData) => 
  {
   
    const formData = new FormData();


    if(customer)
    {
      formData.append("customer_id", customer._id);
    }
    //convert form data into json
    formData.append(`firstName`, formDataJson.firstName);
    formData.append("lastName", formDataJson.lastName);
    formData.append('email', formDataJson.email.toLowerCase());
    formData.append('streetAddress1', formDataJson.streetAddress1);
    formData.append('streetAddress2', formDataJson.streetAddress2);
    formData.append('city', formDataJson.city);
    formData.append('state', formDataJson.state);
    formData.append('postalCode', formDataJson.postalCode);
    formData.append('dob', `${formDataJson.dob.toString()}`);
    formData.append('phoneNumber', formDataJson.phoneNumber);
    formData.append('gender', formDataJson.gender);
    formData.append('password', formDataJson.password);

    
    if(formDataJson.imageUrl)
    {
      formDataJson.imageUrl.forEach((url, index) =>
      {
        formData.append(`imageUrl[${index}]`, url);
      });
    }
    
    formData.append(`imageFile`, formDataJson.imageFile[0]);

    onCreate(formData);
  });
  
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit}>
        <CustomerDetailsSection/>
        <CustomerImageSection/>
        <span>
          <button disabled={isLoading} type="submit" className="btn btn-dark  me-2">
            {isLoading ? "Saving..." : (userRole === UserRole.CUSTOMER ? "Update Profile" 
                : (customer ? "Update Customer" : "Create Customer"))}
          </button>

        </span>

        {customer && userRole === UserRole.ADMIN &&
          <span className="me-2">
            <DeleteBtnWithConfirmationModal
              title={'Delete Customer'} 
              text={`Are you sure you want to delete customer ${customer.firstName}?`}
              onDelete={() => handleDeleteEmployee(customer._id)}/>
          </span>
        }
        <span>
          <Link to={userRole !== UserRole.CUSTOMER ? '/customers': '/'} className='btn btn-dark'>Back</Link>
        </span>
      </form>
      </FormProvider>
  );
}

export default  CustomerForm;