import { FormEvent, useState } from "react";


type  Props = 
{
  onFilter: (filterValue: string) => void;
}


const CustomerLoanFilterBar =({onFilter}: Props)=>
{
  const [status, setStatus] = useState('')


  const handleSubmit = (event: FormEvent)=>
  {
    event.preventDefault();
    onFilter(status);
  };

  return(
    <form onSubmit={handleSubmit}>
     <div className="row">
      <div className="col-3">
            <select className="form-select" value={status} onChange={(event)=> setStatus(event.target.value)}>
                <option value="">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Declined">Declined</option>
                <option value="Canceled">Canceled</option>
                <option value="Refunded">Refunded</option>
            </select>
      </div>
      <div className="col">
        <button className="btn btn-outline-dark">Filter</button>
      </div>
     </div>
      
    </form>
  );
}

export default  CustomerLoanFilterBar;