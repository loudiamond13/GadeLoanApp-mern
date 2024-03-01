

 type Props = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({totalPages, currentPage, onPageChange}: Props) => 
{
  return (
    <nav>
      <ul className="pagination pagination-dark">
        {Array.from({ length: totalPages }, (_, index) => (
          <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
            <button onClick={() => onPageChange(index + 1)} className="page-link">{index + 1}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export  default Pagination;