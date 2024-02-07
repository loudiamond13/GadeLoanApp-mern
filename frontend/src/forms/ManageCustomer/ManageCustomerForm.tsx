import { FormProvider, useForm } from "react-hook-form";
import CustomerDetailsSection from "./CustomerDetailsSection";
import CustomerImageSection from "./CustomerImageSection";

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
  isActive:boolean;
};

type Props = 
{
  onCreate:(customerFormData:FormData) => void
  isLoading: boolean
}


const ManageCustomerForm =({onCreate,isLoading}: Props) =>
{
  const  formMethods = useForm<CustomerFormData>();
  const {handleSubmit} = formMethods;

  const onSubmit = handleSubmit((formDataJson: CustomerFormData) => 
  {
    console.log(formDataJson)
    //create new form data object and call api
    const formData = new FormData();
    //convert form data into json
    formData.append(`firstName`, formDataJson.firstName)
    formData.append("lastName", formDataJson.lastName);
    formData.append('email', formDataJson.email);
    formData.append('streetAddress', formDataJson.streetAddress);
    formData.append('barangay', formDataJson.barangay);
    formData.append('cityMunicipality', formDataJson.cityMunicipality);
    formData.append('province', formDataJson.province);
    formData.append('dob', `${formDataJson.dob.toString()}`);
    formData.append('phoneNumber', formDataJson.phoneNumber);
    formData.append('sex', formDataJson.sex);
    formData.append('branch', formDataJson.branch);
    formData.append('isActive', formDataJson.isActive.toString());
    formData.append(`imageFile`, formDataJson.imageFile[0]);
    // Array.from(formDataJson.imageFile).forEach((imageFile)=>
    // {
    //   formData.append(`imageFile`,imageFile);
    // });

    onCreate(formData);
    console.log(formData);
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