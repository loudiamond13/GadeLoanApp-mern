import { useForm,FormProvider } from "react-hook-form";
import { UserType } from "../../../../backend/src/models/userModel";
import { useEffect } from "react";
import UserDetailsSection from "./UserDetailsSection";
import { Link } from "react-router-dom";




export type UserFormData=
{
  newEmail: string;
  confirmNewEmail: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword:string;
  firstName: string;
  lastName: string;

}

type Props = 
{
  user?: UserType;
  onSave: (userFormData:FormData) => void;
}

const ManageUserForm=({onSave, user}: Props)=>
{
  const formMethods = useForm<UserFormData>();
  const {reset, handleSubmit} = formMethods;

  useEffect(()=>
  {
    reset(user);
  },[user, reset]);

  const onSubmit = handleSubmit((formdataJson: UserFormData)=>
  {
    const formData = new FormData();

    if(user)
    {
      formData.append('user_id', user?._id);
    }


    formData.append('confirmNewEmail', formdataJson.confirmNewEmail);
    formData.append('currentPassword', formdataJson.currentPassword);
    formData.append('confirmNewPassword', formdataJson.confirmNewPassword);
    formData.append('firstName', formdataJson.firstName);
    formData.append('lastName', formdataJson.lastName);

    onSave(formData);
  });

  return(
  <FormProvider {...formMethods}>
    <form onSubmit={onSubmit}>
    <UserDetailsSection user={user}/>
    <span>
          <button className="btn btn-dark me-3" type="submit">
                Update
          </button>
          <Link className="btn btn-dark" to='/'>Cancel</Link>
        </span>
    </form>
  </FormProvider>
  );
}

export default ManageUserForm;