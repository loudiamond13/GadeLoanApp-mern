import { useFormContext } from "react-hook-form";
import { CustomerFormData } from "./ManageCustomerForm";

const CustomerImageSection =()=>
{
  const {register} = useFormContext<CustomerFormData>();

  return(
    <div className="row mt-2">
      <h3 className="fw-medium">Image</h3>
      <div className="col-md-6">
        <input type="file" multiple accept="image/*" className="form-control " {...register("imageFile")}/>
      </div>
    </div>
  );
}; 

export  default CustomerImageSection;