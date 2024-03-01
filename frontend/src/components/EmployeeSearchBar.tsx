import { FormEvent, useState } from "react";

type Props =
{
  onSearch:(searchString: string)=>void;
}

const EmployeeSearchBar =({onSearch}: Props)=>
{
  const [searchString, setSearchString] = useState('');
  
  const handleSubmit = (event: FormEvent) =>
  {
    event.preventDefault();
    onSearch(searchString);
  }

  return(
    <form onSubmit={handleSubmit} className="my-3 me-0 " role="search">
      <div className="row">
       <div className="col">
         <input type="text" value={searchString} placeholder="Search..." className="form-control" aria-label="Search"
         onChange={(event)=> setSearchString(event.target.value)}/>
       </div>
        <div className="col-3 me-3">
          <button type="submit" className="btn-outline-dark btn ">
            Search
          </button>
        </div>
      </div>
    </form>
  );
}


export default  EmployeeSearchBar;