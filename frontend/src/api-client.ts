import { SignInFormData } from "./pages/SignIn";
import { RegisterFormData } from "./pages/register";
import {CustomerType} from '../../backend/src/models/customerModel'
import {TransactionsType} from '../../backend/src/models/transactionModel';
import {UserType} from '../../backend/src/models/userModel';

//gets the base url from env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

//register user using the data comming from formdata/body
export const register = async (formData:RegisterFormData) =>  
{
  //fetch
  const response = await fetch(`${API_BASE_URL}/api/users/register`, 
  {
    method : 'POST',
    credentials: 'include',// tells the browser  to include cookies in requests made to this URL
    headers: 
    {
      'Content-Type': 'application/json' // tells the backend  that we are sending json format // content type
    },
    body: JSON.stringify(formData),
  });

  //if fetch is not ok,  throw error with status and message
  if(!response.ok) 
  {
    const responseBODY = await response.json();
    throw new Error(responseBODY.message);
  }

}

//sign in from data
export const signIn = async (formData:SignInFormData) => 
{
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, 
  {
    method: 'POST',
    credentials:'include', // tells the browser  to include cookies in requests made to this URL
    headers:{'Content-Type': 'application/json'}, // tells the backend  that we are sending json format // content type
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();
  if(!response.ok) // if responsebody is not  OK , throws an error with status and message
  {
    throw new Error(responseBody.message);
  }
 
  return responseBody;
};


//validate user token 
//authorization
export const validateToken = async () => 
{
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {credentials:'include'});
  
  
  if(!response.ok)
  {
    throw  new Error('Invalid token');
  }

  return response.json();
}

//fetch user
export const fetchUserByID =async(user_id:string): Promise<UserType> =>
{
  const response = await fetch(`${API_BASE_URL}/api/users/${user_id}`,
  {
    credentials: 'include',
    method:'GET'
  });

  if(!response.ok)
  {
    throw new Error('Error on fetching customer!')
  }

  return response.json();
}

export const updateUserByID = async(userFormData: FormData) =>
{
  const response = await fetch(`${API_BASE_URL}/api/users/${userFormData.get('user_id')}`,
  {
    body: userFormData,
    method: "PUT",
    credentials: 'include',
  });

  
  if(!response.ok)
  {
    const responseBody = await response.json();
    throw new Error(responseBody.message || 'Server error!');
  }

  return response.json();
}

//fetch api logout
export const logOut = async () => 
{
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`,
  {
    credentials:'include',
    method:"POST"
  });

  if(!response.ok)
  {
    throw new Error("ERROR ON SIGNING OUT!");
  }

};


//create/add employee
export const createEmployee = async(formData: RegisterFormData)=>
{
   //fetch
   const response = await fetch(`${API_BASE_URL}/api/users/create-employee`, 
   {
     method : 'POST',
     credentials: 'include',// tells the browser  to include cookies in requests made to this URL
     headers: 
     {
       'Content-Type': 'application/json' // tells the backend  that we are sending json format // content type
     },
     body: JSON.stringify(formData),
   });
 
   //if fetch is not ok,  throw error with status and message
   if(!response.ok) 
   {
     const responseBODY = await response.json();
     throw new Error(responseBODY.message);
   }
}

//gets all employee
export const fetchEmployees= async():Promise<UserType[]> => 
{
  const response = await fetch(`${API_BASE_URL}/api/users/employees`,
  {
    method:"GET",
    credentials: 'include'
  });

  if(!response.ok)
  {
    const responseBODY = await response.json()
    throw new Error(responseBODY.message || 'Server error!');
  }

  return response.json()
}

//deletes an employee by id
export const deleteUserByID = async (id:string) =>
{
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`,
  {
     method:'DELETE',
     credentials: "include"
  });

  if (!response.ok)
  {
    const responseBODY = await response.json()
    throw new Error(responseBODY.message || 'Server error!');
  }
}


//locking and unlocking user
export const lockUserByID = async (id:string, isLocked:boolean) => {
  const response = await fetch(`${API_BASE_URL}/api/users/lock-unlock/${id}`, {
    method: 'PUT',
    headers: 
    {
      'Content-Type': 'application/json'
    },
    //set action
    //if  it's locked set the action to be unlocked
    body: JSON.stringify({ action: isLocked ? 'unlock' : 'lock' })
  });

  if (!response.ok) {
    const responseBODY = await response.json();
    throw new Error(responseBODY.message || 'Server error!');
  }
};

//resend email verification
export const resendEmailVerification = async(user_id: string) => 
{
  const response = await fetch(`${API_BASE_URL}/api/users/resend-verification/${user_id}`,
  {
    method : "POST",
    credentials:'include',
  });

  if (!response.ok)  
  {
    const responseBody = await response.json();
    throw new Error(responseBody.message || 'Server error!');
  }

  return response.json()
}

//verifyEmail
export const verifyEmail =async(user_id:string, token:string)=>
{
  //calls the back end route
  const response = await fetch(`${API_BASE_URL}/api/users/${user_id}/verify/${token}/`,
  {
    method:'POST',
  });

  if(!response.ok)
  {
    throw new Error('Invalid or expired link');
  }

  // Email verification was successful
  return response.json(); // Or return any other relevant data from the response

}

//forgot password
//for sending link 
export const forgotPassword = async(forgotPasswordData:FormData) =>
{
  const response = await fetch(`${API_BASE_URL}/api/users/forgot-password`,
  {
    method:"POST",
    credentials:'include',
    body: forgotPasswordData,
  });

  if (!response.ok)  
  {
    const responseBody = await response.json();
    throw new Error(responseBody.message || 'Email do not exist.');
  }

  return response.json();
}

//resetting password
export const resetPassword = async(resetPasswordData:FormData) =>
{
  const response = await fetch(`${API_BASE_URL}/api/users/forgot-password/${resetPasswordData.get('user_id')}`,
  {
    body: resetPasswordData,
    method: 'POST'
  });

  if (!response.ok)  
  {
    const responseBody = await response.json();
    throw new Error(responseBody.message || 'Server error!');
  }

  return response.json();
};

//creating customer fetch api
export const createCustomer = async(customerFormData: FormData)=> 
{
  
  const response = await fetch(`${API_BASE_URL}/api/customers`,  
  {
    method:'POST',
    credentials:'include',
    body: customerFormData
  });

  if(!response.ok)
  {
    throw new Error('Error on creating the customer!');
  }

  return response.json();
};




//fetching customers client api
export const fetchCustomers = async(): Promise<CustomerType[]>=>
{
  const response = await fetch(`${API_BASE_URL}/api/customers`,{credentials:'include'});

  if(!response.ok)
  {
    throw new Error('Error fetching customers!');
  }
  
  return response.json();
}

//finds just one customer  by id
export const fetchCustomer = async(customer_id : string): Promise<CustomerType> =>
{
  const response = await fetch(`${API_BASE_URL}/api/customers/${customer_id}`, 
  {
    method:'GET',
    credentials: 'include'
  });
  if (!response.ok)
  {
    throw new Error(`Can't find Customer.`);
  }

  return response.json();
}

//updates a customer
export const updateCustomer = async(customerFormData: FormData) =>
{
  const response = await fetch(`${API_BASE_URL}/api/customers/${customerFormData.get("customer_id")}`, 
  {
    method: 'PUT',
    credentials: "include",
    body: customerFormData,
  });

  if(!response.ok)
  {
    throw new Error('Error on updating Customer');
  }

  return response.json();
}

//customer transaction fetch api
export const fetchCustomerTransactions = async(customer_id: string): Promise<TransactionsType>=>
{
  const response = await fetch(`${API_BASE_URL}/api/transactions/${customer_id}`,
  {
    method:"GET",
    credentials:'include'
  });

  if(!response.ok)
  {
    throw  new Error("Couldn't get transactions for this user");
  }
  
  return response.json()
}

//update a customer transaction
export const updateCustomerPaymentTransaction = async(transactionFormData: FormData) =>
{

    console.log('API debug: ', transactionFormData.get("amount"));

    const response = await fetch(`${API_BASE_URL}/api/transactions/payment/${transactionFormData.get('customer_id')}`,
    {
      method:"PUT",
      body:transactionFormData,
      credentials: "include",
    });

    if(!response.ok)
    {
      throw new Error('Failed to Update Customer Transaction');
    }
    
    return response.json();
 
};




