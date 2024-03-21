import { SignInFormData } from "./pages/shared_pages/SignIn";
import { RegisterFormData } from "./pages/register";
import {CustomerType} from '../../backend/src/models/customerModel'
import { PaymentTransaction} from '../../backend/src/models/loanModel';
import {UserType} from '../../backend/src/models/userModel';
import {LoanListResponse, PaymentIntentResponse, UserListResponse} from '../../backend/src/utilities/types';
import { PaymentFormData } from "./forms/PaymentForm/PaymentForm";

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
export const fetchCurrentUser =async(): Promise<UserType> =>
{
  const response = await fetch(`${API_BASE_URL}/api/users/current-user`,
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

//gets all users
export const fetchUsers= async(searchString: string, pageNum: number, role: string):Promise<UserListResponse> => 
{
  const queryParams = new URLSearchParams();

  if(searchString)
  {
    queryParams.append('search', searchString);
  }
  if(role)
  {
    queryParams.append('role', role);
  }
  if(pageNum)
  {
    queryParams.append('pageNum', pageNum.toString());
  }

  const queryString = queryParams.toString();

  //build the query string, if no query string set the value ''/ empty string
  const apiUrl = `${API_BASE_URL}/api/users/users${queryString ? `?${queryString}`:''}`;

  const response = await fetch(apiUrl,
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
export const resendEmailVerification = async() => 
{
  const response = await fetch(`${API_BASE_URL}/api/users/resend-verification`,
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
  
  const response = await fetch(`${API_BASE_URL}/api/customers/register`,  
  {
    method:'POST',
    credentials:'include',
    body: customerFormData
  });

  if(!response.ok)
  {
    const responseBody = await response.json();
    throw new Error(responseBody.message || 'Server error!');
  }

  return response.json();
};




//gets the customer list
export const fetchCustomers = async (searchString: string, pageNum: number) => {
  const queryParams = new URLSearchParams();
  if (searchString) {
    queryParams.append('search', searchString);
  }
  if (pageNum) {
    queryParams.append('pageNum', pageNum.toString());
  }

  const queryString = queryParams.toString();
  const apiUrl = `${API_BASE_URL}/api/customers${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(apiUrl, { credentials: 'include' });

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || 'Server error!');
  }

  return response.json();
};


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
    const responseBody = await response.json();
    throw new Error(responseBody.message || 'Server error!');
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
    const responseBody = await response.json();
    throw new Error(responseBody.message || 'Server error!');
  }

  return response.json();
}

//customer transaction fetch api
export const fetchCustomerLoans = async(customer_id: string, status: string, pageNumber: number): Promise<LoanListResponse>=>
{
  const queryParams = new URLSearchParams();
  if(status)
  {
    queryParams.append('status', status);
  }
  if(pageNumber)
  {
    queryParams.set('pageNum', pageNumber.toString());
  }

  const queryString = queryParams.toString();
  const apiUrl = `${API_BASE_URL}/api/loans/${customer_id}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(apiUrl, {credentials: 'include'});

  if(!response.ok)
  {
    const responseBody = await response.json();
    throw new Error(responseBody.message || 'Server error!');
  }
  
  return response.json()
}

//fetch customer loan/payment transaction by id
export const fetchCustomerPaymentTransactionByID = async(customer_id:string ,paymentTransaction_id : string) 
          :Promise<PaymentTransaction> =>
{
  const response = await fetch(`${API_BASE_URL}/api/loans/${customer_id}/payment/${paymentTransaction_id}`,
  {
    method: 'GET',
    credentials: 'include'
  });

  if(!response.ok)
  {
    const responseBody = await response.json();
    throw new Error(responseBody.message || 'Server Error');
  }

  return response.json();
}

//create customer Loan
export const createCustomerLoan = async(customerLoanData: FormData) => 
{
  const response = await fetch(`${API_BASE_URL}/api/loans/${customerLoanData.get('customer_id')}`,
  {
    method: 'POST',
    body:customerLoanData,
    credentials: 'include'
  });

  if(!response.ok)
  {
    const responseBody = await response.json();
    throw new Error(responseBody.message || 'Error creating loan transaction!');
  }

  return response.json();
}


//create payment intent
export const createPaymentIntent = async(customer_id: string, paymentTransaction_id: string)
        : Promise<PaymentIntentResponse> =>
{
  const response = await fetch(`${API_BASE_URL}/api/loans/${customer_id}/payment-intent/${paymentTransaction_id}`,
  {
    method:'POST',
    credentials: 'include',
    headers: {
      "Content-Type": "application/json"
    }
  });

  if(!response.ok)
  {
    const responseBody = await response.json();
    throw new Error(responseBody.message || 'Error on creating payment Intent');
  }

  return response.json();
}

export const createPayment = async(paymentFormData: PaymentFormData) =>
{
  const response = await fetch(`${API_BASE_URL}/api/loans/${paymentFormData.customer_id}/payment/${paymentFormData.paymentTransaction_id}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(paymentFormData),
  });

  
  if(!response.ok)
  {
    const responseBody = await response.json();
    throw new Error(responseBody.message || 'Error on creating payment Intent');
  }

  return response.json();
}


//approve a loan
export const approveLoan = async(loan_id: string, interestRate: string) =>
{
  const response = await fetch(`${API_BASE_URL}/api/loans/approval/${loan_id}`, 
  {
    method:"PUT",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ interestRate })
  });

  if(!response.ok)
  {
    const responseBody = await  response.json();
    throw new Error(responseBody.message || 'Server error while trying to approve loan');
  }

  return response.json();
}

//decline a loan
export const declineLoan = async(loan_id: string) =>
{
  const response = await fetch(`${API_BASE_URL}/api/loans/decline/${loan_id}`, 
  {
    method:"PUT",
    credentials: 'include'
  });

  if(!response.ok)
  {
    const responseBody = await  response.json();
    throw new Error(responseBody.message || 'Server error while trying to approve loan');
  }

  return response.json();
}


//refund a loan
export const refundLoan = async(loan_id:string) =>
{
  const response = await fetch(`${API_BASE_URL}/api/loans/refund/${loan_id}`, 
  {
    method:"PUT",
    credentials: 'include'
  });

  if(!response.ok)
  {
    const responseBody = await  response.json();
    throw new Error(responseBody.message || 'Server error while trying to refund loan');
  }

  return response.json();
}


//cancelLoan
export const cancelLoan = async(loan_id:string) =>
{
  const response = await fetch(`${API_BASE_URL}/api/loans/cancel/${loan_id}`, 
  {
    method:"PUT",
    credentials: 'include'
  });

  if(!response.ok)
  {
    const responseBody = await  response.json();
    throw new Error(responseBody.message || 'Server error while trying to cancel a loan');
  }

  return response.json();
}


export const getLoanRequests= async(searchString: string, pageNum: number): Promise<LoanListResponse>=>
{
  //build the query params
  const queryParams = new URLSearchParams();
  if(searchString)
  {
    queryParams.append('search', searchString);
  }
  if(pageNum)
  {
    queryParams.append('pageNum', pageNum.toString());
  }

  const queryString = queryParams.toString();
  
  //builds the url
  //if there is query string add it to the url for searching/pagination, else just empty string
  const apiUrl = `${API_BASE_URL}/api/loans/customers/loan-request${queryString ? `?${queryString}` : ''}`;


  const response = await fetch(apiUrl,
  {
    credentials:'include',
  });

  if(!response.ok)
  {
    const responseBody = await response.json();
    throw new Error(responseBody.message || 'Server error while retrieving loan request data.');
  }

  return response.json();
}


export const getLoanRequestsCount = async()=>
{
  const response =  await fetch(`${API_BASE_URL}/api/loans/loan-requests/count`,
  {
    method:'GET',
    credentials: 'include'
  });

  if(!response.ok)
  {
    const responseBody = await response.json();
    throw new Error(responseBody.message || 'Server  error while getting the count of loan requests');
  }

  return response.json();
}




