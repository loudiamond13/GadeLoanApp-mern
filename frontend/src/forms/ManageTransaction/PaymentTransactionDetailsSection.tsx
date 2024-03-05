import { useFormContext } from "react-hook-form";
import { CustomerPaymentTransactionData } from "./ManagePaymentTransactionForm";



const PaymentTransactionDetailsSection =()=> 
{

  const {register, formState:{errors}} = useFormContext<CustomerPaymentTransactionData>();
  return(
    <div className="row">
          <label className="form-label col-lg-3">Payment Amount: 
            <input className="form-control" type="text"
            {...register('amount', {required: 'Amount is Required!'})}/>
            {
              errors.amount && 
              (<span className="text-danger">{errors.amount.message}</span>)
            }
          </label> 
          <label className="form-label col-lg-3">Date: 
            <input className="form-control" type="date" defaultValue={new Date().toISOString().substr(0,10)}
            {...register('date', {required: 'Date is Required!'})}/>
            {
              errors.date && 
              (<span className="text-danger">{errors.date.message}</span>)
            }
          </label> 
        </div>
  );
};


export default PaymentTransactionDetailsSection;