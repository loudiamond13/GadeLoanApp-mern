import { useFormContext } from "react-hook-form";
import { CustomerFormData } from "./ManageCustomerForm";

const CustomerImageSection =()=>
{
  const {register, watch} = useFormContext<CustomerFormData>();

  const existingImage = watch('imageUrl');

  return(
    <div className="row mt-2">
      <h3 className="fw-medium">Image</h3>
      <div className="col-md-6">
        {existingImage && 
        (
          <div className="col-6 position-relative">
            <img className="customerImage my-3" src={existingImage[0]} alt="" />
          </div>
        )}
        <input type="file"  accept="image/*" className="form-control " {...register("imageFile")}/>
      </div>
    </div>
  );
}; 

export  default CustomerImageSection;