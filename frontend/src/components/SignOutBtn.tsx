import { useMutation, useQueryClient } from "react-query";
import * as apiClient from '../api-client';
import { useAppContext } from "../contexts/AppContext";


const LogOutBtn = () => 
{

  const queryClient = useQueryClient();
  const {showToast} = useAppContext();
  const mutation = useMutation(apiClient.logOut, 
    {
      onSuccess: async ()=>
      {
        await queryClient.invalidateQueries('validateToken');
        //show toast
        showToast({type:"success", message:"Logged out successfully"});

      },
      onError: (error: Error) =>
      {
        //show error toast
        showToast({type: 'error', message: error.message})

      }
    });

    const handleClick = ()=> 
    {
      //invokes the api call
      mutation.mutate();
    }

    return (
      <button onClick={handleClick} className="btn btn-primary">Log out</button>
    );
};

export  default LogOutBtn;