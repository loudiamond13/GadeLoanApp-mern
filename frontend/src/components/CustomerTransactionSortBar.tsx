import { FormEvent, useState } from "react";


type Props = 
{
  onSortChange: (sortBy: string,  transactionType: string ) => void;
}

const CustomerTransactionSortBar =({onSortChange}:Props)=>
{

  const [sortBy, setSort] = useState('latest');
  const [transactionType, setTransactionType] = useState('');


  const handleSubmit = (event : FormEvent) =>
  {
    event.preventDefault();
    onSortChange(sortBy, transactionType);
  }

  return(
  <form onSubmit={handleSubmit}>
    <div className="row">
      <div className="col-3">
        <select value={sortBy} onChange={(event)=> setSort(event.target.value)} className="form-select">
          <option value="latest">Latest to Oldest</option>
          <option value="oldest">Oldest to Latest</option>
        </select>
      </div>
      <div className="col-3">
        <select value={transactionType || ""} onChange={(event)=> setTransactionType(event.target.value)} className="form-select">
          <option value="">All Transactions</option>
          <option value="loan">Loan</option>
          <option value="pay">Pay</option>
        </select>
      </div>
      <div className="col-3">
          <button type="submit" className="btn-outline-dark btn ">
            Sort
          </button>
      </div>
    </div>
  </form>
  );
}

export default CustomerTransactionSortBar;