import { FormEvent, useState } from "react";

type Props =
{
  onSearch:(searchValue: string, branch: string) => void;
}

const CustomerSearchBar =({onSearch}: Props)=>
{
 

  const [searchString, setSearchString] = useState<string>('');
  const [branch, setBranch] = useState<string>('')

  const handleSubmit = (event: FormEvent)=>
  {
    event.preventDefault();
    onSearch(searchString, branch);
  };

  return(
    <form onSubmit={handleSubmit} className="my-3 me-0 " role="search">
      <div className="row">
       <div className="col">
         <input type="text" value={searchString} placeholder="Search..." className="form-control" aria-label="Search"
         onChange={(event)=> setSearchString(event.target.value)}/>
       </div>
       <div className="col-4">
          <select className="form-select" value={branch} onChange={(event)=> setBranch(event.target.value)}>
              <option value="">-Branch-</option>
              <option value="Carmen">Carmen</option>
              <option value="Buenavista">Buenavista</option>
          </select>
       </div>
        <div className="col-3">
          <button type="submit" className="btn-outline-dark btn ">
            Search
          </button>
        </div>
      </div>
    </form>
  );
}

export default CustomerSearchBar;