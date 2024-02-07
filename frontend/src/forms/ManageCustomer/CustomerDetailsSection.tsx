import { useFormContext } from "react-hook-form"
import { CustomerFormData } from "./ManageCustomerForm";

const CustomerDetailsSection =()=>
{
  const {register, formState:{errors}} = useFormContext<CustomerFormData>();

  return(
    <div>
      <h2 className="fw-bold mb-3">Create Customer</h2>
      <div className="row">
        <label  className="form-label col-md-6">First Name
                <input type="text" className="form-control"
                {...register(`firstName`,{required: `First Name is required.`})}/>
                {
                  errors.firstName && 
                  (<span className="text-danger">{errors.firstName.message}</span>)
                }
        </label>
        <label  className="form-label col-md-6">Last Name
                <input type="text" className="form-control"
                {...register(`lastName`,{required: `Last Name is required.`})}/>
                {
                  errors.lastName && 
                  (<span className="text-danger">{errors.lastName.message}</span>)
                }
        </label>
      </div>
      <div className="row">
        <label  className="form-label col-md-6">Date of Birth
                <input type="date" className="form-control"
                {...register(`dob`,{required: `Date of Birth is required.`})}/>
                {
                  errors.dob && 
                  (<span className="text-danger">{errors.dob.message}</span>)
                }
        </label>
        <label  className="form-label col-md-6">Gender
              <select className="form-select" {...register('sex',{required: 'Please select a Gender.'})}>
                <option value="">---Select Gender---</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
                {
                  errors.sex && 
                  (<span className="text-danger">{errors.sex.message}</span>)
                }
        </label>
      </div>
      <div className="row">
      <label  className="form-label col-md-6">Email
                <input type="email" className="form-control"
                {...register(`email`,{required: `Email is required.`})}/>
                {
                  errors.email && 
                  (<span className="text-danger">{errors.email.message}</span>)
                }
        </label>
        <label  className="form-label col-md-6">Phone Number
                <input type="text" className="form-control"
                {...register(`phoneNumber`,{required: `Phone Number is required.`})}/>
                {
                  errors.phoneNumber && 
                  (<span className="text-danger">{errors.phoneNumber.message}</span>)
                }
        </label>
      </div>
      <div className="row">
      <label  className="form-label col-md-6">Street Address
                <input type="text" className="form-control"
                {...register(`streetAddress`,{required: `Street Address is required.`})}/>
                {
                  errors.streetAddress && 
                  (<span className="text-danger">{errors.streetAddress.message}</span>)
                }
        </label>
        <label  className="form-label col-md-6">Barangay
                <input type="text" className="form-control"
                {...register(`barangay`,{required: `Barangay is required.`})}/>
                {
                  errors.barangay && 
                  (<span className="text-danger">{errors.barangay.message}</span>)
                }
        </label>
      </div>
      <div className="row">
      <label  className="form-label col-md-6">Municipality
                <input type="text" className="form-control"
                {...register(`cityMunicipality`,{required: `Municipality is required.`})}/>
                {
                  errors.cityMunicipality && 
                  (<span className="text-danger">{errors.cityMunicipality.message}</span>)
                }
        </label>
        <label  className="form-label col-md-6">Province
                <input type="text" className="form-control"
                {...register(`province`,{required: `Province is required.`})}/>
                {
                  errors.province && 
                  (<span className="text-danger">{errors.province.message}</span>)
                }
        </label>
      </div>
      <div className="row">
      <label  className="form-label col-md-6">Branch
               <select className="form-select" {...register('branch',{required:'Branch is required'})}>
                <option value="">---Select A Branch---</option>
                <option value="Carmen">Carmen</option>
                <option value="Buenavista">Buenavista</option>
               </select>
                {
                  errors.branch && 
                  (<span className="text-danger">{errors.branch.message}</span>)
                }
        </label>
      </div>
      <div className="row mt-2">
        <label  className="form-label col-md-6 ">Is Active Customer?
          <input type="radio" className="btn-check" id="active" value="true" checked {...register(`isActive`)}/>
          <label htmlFor="active" className="mx-2 btn btn-outline-success">Yes, Active</label>

          <input type="radio" className="btn-check" id="Inactive" value="false" {...register(`isActive`)}/>
          <label htmlFor="Inactive" className="mx-2 btn btn-outline-danger">No, Inactive</label>
        </label>
      </div>
    </div>
  );
};

export default  CustomerDetailsSection;