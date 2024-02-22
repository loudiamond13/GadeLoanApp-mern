import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from '../api-client';
// import Toast from "../components/Toast";

//toast message
type ToastMessage = {
  message : string;
  type:   "success" | "error";
 
};

type AppContext = 
{
  showToast: (toastMessage: ToastMessage)=> void;
  isLoggedIn: boolean;
  userRole: string;
  user_id:string;
  userFirstName: string;
  userLastName: string;
};

const AppContext = React.createContext<AppContext | undefined>(undefined);


//accepts prop
//provider
export const AppContextProvider =({children}:{children: React.ReactNode})=> 
{
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const {isError,data} = useQuery('validateToken', apiClient.validateToken, {retry: false});
 
  
  return(
    <AppContext.Provider 
    value={{showToast: (toastMessage) => {setToast(toastMessage)}, 
          isLoggedIn: !isError, userRole: data?.userRole, user_id: 
          data?.userID, userFirstName: data?.userFname, userLastName: data?.userLname}}>
      {toast &&
       (<Toast message={toast.message} type={toast.type} onClose={()=> setToast(undefined)}/>)}
      {children};
    </AppContext.Provider>
  );  
};

//provider accessor
export const  useAppContext =() =>  
{
 const context = useContext(AppContext);
 return context as AppContext;
};