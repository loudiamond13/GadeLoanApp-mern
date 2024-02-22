import { useFormContext } from "react-hook-form";
import { CustomerTransactionData } from "./ManageTransactionForm";


const TransactionDetailsSection =()=> 
{

  const {register, formState:{errors}} = useFormContext<CustomerTransactionData>();
  return(
    <div className="row">
          <label className="form-label col-lg-3">Amount: 
            <input className="form-control" type="text"
            {...register('amount', {required: 'Amount is Required!'})}/>
            {
              errors.amount && 
              (<span className="text-danger">{errors.amount.message}</span>)
            }
          </label> 
          <label  className="form-label col-lg-3">Transaction Code(Pay/Loan):
              <select className="form-select" {...register('transaction_code',{required:'Transaction Code(Pay/Loan) is required'})}>
              <option value="">---Select A Transaction Code---</option>
              <option value="Pay">Pay</option>
              <option value="Loan">Loan</option>
              </select>
              {
                errors.transaction_code && 
                (<span className="text-danger">{errors.transaction_code.message}</span>)
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


export default TransactionDetailsSection;