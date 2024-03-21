import { FormEvent, useState } from "react";

type Props =
{
  onSearch:(searchString: string, roleFilter: string)=>void;
}

const UsersSearchBar =({onSearch}: Props)=>
{
  const [searchString, setSearchString] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('employee');

  const handleSubmit = (event: FormEvent) =>
  {
    event.preventDefault();
    onSearch(searchString, roleFilter);
  }

  return(
    <form onSubmit={handleSubmit} className="my-3 me-0 " role="search">
      <div className="d-flex">
       <div className="me-2">
         <input type="text" value={searchString} placeholder="Search..." className="form-control" aria-label="Search"
         onChange={(event)=> setSearchString(event.target.value)}/>
       </div>
       <div className="me-2">
          <select className="form-select" value={roleFilter} onChange={(event)=> setRoleFilter(event.target.value)}>
              <option value="employee">Employees</option>
              <option value="customer">Customers</option>
              <option value="admin">Admin</option>
          </select>
       </div>
        <div className="">
          <button type="submit" className="btn-outline-dark btn ">
            Search
          </button>
        </div>
      </div>
    </form>
  );
}


export default  UsersSearchBar;