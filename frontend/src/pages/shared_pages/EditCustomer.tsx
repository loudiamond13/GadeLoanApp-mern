import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as apiClient from '../../api-client';
import CustomerForm from "../../forms/CustomerForm/CustomerForm";
import { UserRole } from "../../../../backend/src/utilities/constants";

const EditCustomer =()=>
{
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {customer_id} = useParams();
  const {showToast , userRole} = useAppContext();

  const {data: customer} = useQuery('fetchCustomer',()=> apiClient.fetchCustomer(customer_id || ''));

  const {mutate, isLoading } = useMutation(apiClient.updateCustomer,
  {
    onSuccess:async()=>
    {
      await queryClient.invalidateQueries('fetchCurrentUser');
      if(userRole ===  UserRole.CUSTOMER)
      {
        showToast({message: 'Profile updated successfully.', type: 'success'});
        navigate('/');
      }
      else
      {
        showToast({message: `The customer has been updated.`, type:'success'});
        navigate('/customers')
      }
    },
    onError:()=>
    {
      showToast({message:`An error occurred while updating the customer`, type:"error"});
    }
  });

  const handleSubmit = (customerFormData: FormData) => 
  {
    mutate(customerFormData)
  }

 return(<CustomerForm customer={customer} onCreate={handleSubmit} isLoading={isLoading}/>);
};


export default EditCustomer;