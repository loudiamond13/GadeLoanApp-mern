import { Fragment, useEffect, useState } from "react";
import { BsCheck2Circle } from "react-icons/bs";
import { useParams } from "react-router-dom";
import * as apiClient from '../api-client';



const EmailVerification =()=>
{
  const [validUrl, setValidURL] = useState(true);

  const {user_id, token} = useParams();


  useEffect(() => 
  {
    const verifyUserEmail =async()=>
    {
      try 
      {
        setValidURL(true);
       const data = await apiClient.verifyEmail(user_id ||'',token ||'');
       console.log(data)
        console.log(validUrl)
      } 
      catch (error) 
      {
        setValidURL(false);
        console.log(error)
        console.log('asdasd')
      }
    };
    console.log(validUrl);
    verifyUserEmail();
  },[user_id, token]);

  return(
    <Fragment>
      {validUrl ? (
        <div className="text-center"><h1>Your email is verified! <BsCheck2Circle /></h1></div>
      ):(
      <div className="text-center"><h1>404 URL NOT FOUND!</h1></div>
      )};
    </Fragment>
  );
};

export default EmailVerification;