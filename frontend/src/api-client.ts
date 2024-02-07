import { SignInFormData } from "./pages/SignIn";
import { RegisterFormData } from "./pages/Register";

//gets the base url from env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

//register user using the data comming from formdata/body
export const register = async (formData:RegisterFormData) =>  
{
  //fetch
  const response = await fetch(`${API_BASE_URL}/api/users/register/`, 
  {
    method : 'POST',
    credentials: 'include',// tells the browser  to include cookies in requests made to this URL
    headers: 
    {
      'Content-Type': 'application/json' // tells the backend  that we are sending json format // content type
    },
    body: JSON.stringify(formData),
  });

  const responseBODY = await response.json();
  //if fetch is not ok,  throw error with status and message
  if(!response.ok) 
  {
    throw new Error(responseBODY.message);
  }
}

//sign in from data
export const signIn = async (formData:SignInFormData) => 
{
  const response = await fetch(`${API_BASE_URL}/api/auth/login/`, 
  {
    method: 'POST',
    credentials:'include', // tells the browser  to include cookies in requests made to this URL
    headers:{'Content-Type': 'application/json'}, // tells the backend  that we are sending json format // content type
    body: JSON.stringify(formData),
  });


  const responseBody = await response.json();
  if(!response.ok) // if responsebody is not  OK , throws an error with status and message
  {
    throw new Error(responseBody.message)
  }

  return responseBody;
};

export const validateToken = async () => 
{
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {credentials:'include'});

  if(!response.ok)
  {
    throw  new Error('Invalid token');
  }

  return response.json();
}

//fetch api
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


//creating customer fetch api
export const createCustomer = async(customerFormData: FormData)=>
{
  const response = await fetch(`${API_BASE_URL}/api/create-customer`, 
  {
    method:'POST',
    credentials:'include',
    body: customerFormData
  });

  if(!response.ok)
  {
    throw new Error('Error in creating the customer!');
  }

  return response.json();
};