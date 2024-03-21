import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from '../api-client';
import { Stripe, loadStripe } from "@stripe/stripe-js";


const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

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
  stripePromise: Promise<Stripe | null>;
};

const AppContext = React.createContext<AppContext | undefined>(undefined);
const stripePromise = loadStripe(STRIPE_PUB_KEY);

//accepts prop
//provider
export const AppContextProvider =({children}:{children: React.ReactNode})=> 
{
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const {isError,data} = useQuery('validateToken', apiClient.validateToken, {retry: false});
 
  
  return(
    <AppContext.Provider 
    value={{showToast: (toastMessage) => {setToast(toastMessage)}, 
          isLoggedIn: !isError, userRole: data?.userRole, user_id: data?.userID, 
          userFirstName: data?.userFname, userLastName: data?.userLname, stripePromise}}>
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