import { FormProvider, useForm } from "react-hook-form";
import { CustomerType } from "../../../../backend/src/models/customerModel";
import { UserRole, formatDateYYYYmmDD } from "../../../../backend/src/utilities/constants";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";


export type CustomerLoanTransactionData =
{
  customer_id: string;
  amount: number;
  date: Date;
  paymentSchedule: string;
  interestRate: number;
  loanTerm: number;
}

type Props =
{
  
  handleSubmitData: (customerLoanTransactionData: FormData) => void;
  customer?: CustomerType;
}


const LoanForm = ({handleSubmitData, customer}:Props) =>
{
  const formMethods = useForm<CustomerLoanTransactionData>(); 
  const {handleSubmit, register, formState:{errors}, watch} = formMethods;
  const {userRole} = useAppContext();
  const {customer_id} = useParams();

  // watch the `date` field
  const date = watch('date');

  // useEffect(()=>
  // {
  //   if(date)
  //   {
  //     setValue('date', date)
  //   }
  // },[date, setValue]);


  const onSubmit = handleSubmit((loanFormData: CustomerLoanTransactionData)=>
  {
    const formData = new FormData();
    

    if(customer)
    {
      formData.append('interestRate', loanFormData.interestRate.toString());
      formData.append('customer_id', customer._id.toString());
    }
    else
    {
      formData.append('interestRate', String(5));
      formData.append('customer_id', customer_id || '');
    }

    formData.append('amount', loanFormData.amount.toString());
    formData.append('date', loanFormData.date.toString());
    formData.append("paymentSchedule", loanFormData.paymentSchedule);
    formData.append('loanTerm', loanFormData.loanTerm.toString());
    formData.append('transactionType', 'Loan');
    handleSubmitData(formData);
  });


  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit}>
        <h3 className="mb-3 text-dark">
          {customer? 'Create Customer Loan': 'Request Loan'}
        </h3>
        {userRole !== UserRole.CUSTOMER &&
          <h5 className="fw-medium">Customer Name: {customer?.firstName + ' '+ customer?.lastName}</h5>
        }
        <div className="row">
          <label className="form-label col-lg-3">Loan Amount: 
              <input className="form-control" type="text"
              {...register('amount', {required: 'Loan amount is Required!'})}/>
              {
                errors.amount && 
                (<span className="text-danger">{errors.amount.message}</span>)
              }
          </label>
          {userRole !== UserRole.CUSTOMER &&
            <label className="form-label col-lg-3">Interest Rate %: 
              <input className="form-control" defaultValue={5} type="number"
              {...register('interestRate', {required: 'Interest rate amount is Required!'})}/>
              {
                errors.interestRate && 
                (<span className="text-danger">{errors.interestRate.message}</span>)
              }
            </label>
          }
        </div>
        <div className="row">
          <label className=" form-label col-lg-3">Payment Schedule:
            <select className="form-select" {...register('paymentSchedule')}>
              <option value={'Monthly'} >Monthly</option>
              <option value={'Bi-weekly'}>Bi-weekly</option>
            </select>
          </label>
          <label className=" form-label col-lg-3">Loan Term:
            <select className="form-select" {...register('loanTerm')}>
              <option value={6} >6 Months</option>
              <option value={12}>12 Months</option>
              <option value={24}>24 Months</option>
              <option value={36}>36 Months</option>
              <option value={48}>48 Months</option>
              <option value={60}>60 Months</option>
              <option value={72}>72 Months</option>
              <option value={84}>84 Months</option>
            </select>
          </label>
          
        </div>
        <div className="row">
          <label className="form-label col-lg-3">Date: 
            <input className="form-control" type="date" 
              value={date ? formatDateYYYYmmDD(new Date(date)) : new Date().toISOString().substr(0,10)}
            {...register('date', {required: 'Date is Required!'})}/>
            {
              errors.date && 
              (<span className="text-danger">{errors.date.message}</span>)
            }
          </label>
          
        </div>
        <span>
          <button className="btn btn-outline-dark fw-medium me-3" type="submit">
                {customer? "Process Loan": "Request Loan"}
          </button>
          <Link to={userRole !== UserRole.CUSTOMER ? `/customers` : '/'} className="btn btn-outline-dark fw-medium  btn">Back</Link>
        </span>
     </form>
    </FormProvider>

  )
}



export default LoanForm;