import { useState } from "react";
import { TransactionsType } from "../../../backend/src/models/transactionModel"
import Pagination from "./Pagination";
import CustomerTransactionSortBar from "./CustomerTransactionSortBar";



type Props =
{
  transaction?: TransactionsType;
}

const CustomerTransactionList =({transaction}:Props) => 
{
  const [ITEMS_PER_PAGE] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("latest");
  const [transactionType, setTransactionType] = useState("");

    

    const filteredTransactions = transaction?.transactions.filter((trans) => {
      if (transactionType && transactionType !== "") {
        return trans.transaction_code.toLowerCase() === transactionType.toLowerCase();
      }
      return true;
    });

    //  Sorting the transactions by date
    const sortedTransactions = filteredTransactions?.sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

    // Calculate index range for current page
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = sortedTransactions?.slice(indexOfFirstItem, indexOfLastItem);

    const handleSortChange = (sortBy: string, transactionType: string) => {
      setSortBy(sortBy);
      setTransactionType(transactionType);
      setCurrentPage(1); //reset the current page to  1 when sorting changes
    };

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

  return(
  <>
    {currentItems?.length ?? 0 > 1 ?
        (
          <div>
            <h3 className="mt-5">Transactions History</h3>
            <CustomerTransactionSortBar onSortChange={handleSortChange}/>
            <div>
              <table className="table table-striped mt-2 col-lg-3">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Transaction Type</th>
                    <th>Transaction Date</th>
                  </tr>
                </thead>
                <tbody>
                {currentItems?.map((trans)=>
                (
                  <tr>
                    <td>${parseFloat(trans.amount.toString()).toFixed(2)}</td>
                    <td>{trans.transaction_code}</td>
                    <td>{`${trans.date}`}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
           
            <Pagination totalPages={Math.ceil(sortedTransactions?.length / ITEMS_PER_PAGE)}
                currentPage={currentPage}
                onPageChange={handlePageChange}/>
            
          </div>
        ):(<h3 className="mt-5">No Transaction History Found</h3>)
        }
  </>);
}

export default CustomerTransactionList;