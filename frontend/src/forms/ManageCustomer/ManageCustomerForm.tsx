import { FormProvider, useForm } from "react-hook-form";
import CustomerDetailsSection from "./CustomerDetailsSection";
import CustomerImageSection from "./CustomerImageSection";
import { CustomerType } from "../../../../backend/src/models/customerModel";
import { useEffect } from "react";

export type CustomerFormData = 
{
  firstName: string;
  lastName: string;
  email: string;
  streetAddress: string;
  barangay: string;
  cityMunicipality: string;
  province: string;
  dob: Date;
  age: number;
  phoneNumber:string;
  sex: string;
  branch: string;
  imageFile: File[];
  imageUrl:string[];
  isActive:boolean;
};

type Props = 
{
  customer?: CustomerType;
  onCreate:(customerFormData:FormData) => void;
  isLoading: boolean;
}



const ManageCustomerForm =({onCreate,isLoading,customer}: Props) =>
{
  const  formMethods = useForm<CustomerFormData>();
  const {handleSubmit,reset} = formMethods;

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
    formData.append('streetAddress', formDataJson.streetAddress);
    formData.append('barangay', formDataJson.barangay);
    formData.append('cityMunicipality', formDataJson.cityMunicipality);
    formData.append('province', formDataJson.province);
    formData.append('dob', `${formDataJson.dob.toString()}`);
    formData.append('phoneNumber', formDataJson.phoneNumber);
    formData.append('sex', formDataJson.sex);
    formData.append('branch', formDataJson.branch);
    formData.append('isActive', formDataJson.isActive.toString());

    
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
        <span className="">
          <button disabled={isLoading} type="submit" className="btn btn-dark fw-medium mt-3">
            {isLoading?  "Creating..." : "Create Customer"}
          </button>
        </span>
      </form>
      </FormProvider>
  );
}

export default  ManageCustomerForm;