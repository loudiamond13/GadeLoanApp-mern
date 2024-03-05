import express,{Request, Response} from "express";
import verifyToken, { isEmployee } from "../middleware/auth";
import Transaction, { TransactionsType } from "../models/transactionModel";


import multer from "multer";
import { check, validationResult } from "express-validator";
import { UserRole } from "../utilities/constants";
const upload = multer();


const router = express.Router();

// get customer transactions
router.get('/:id',verifyToken, async (req:Request, res:Response) =>
{
  //the customer id
  const id= req.params.id.toString();

  try
  {
    //find the a transaction using the  given ID and return it to the user if found otherwise make a new transaction for the user
    const customerTransaction = await Transaction.findOne({customer_id : id});
    //if there is no transaction for the customer make a new one
    if(!customerTransaction)
    {
      const  newCustomerTransaction = new Transaction({customer_id : id});
      await newCustomerTransaction.save();
      res.json(newCustomerTransaction);
    }
    else
    {
      res.status(200).json(customerTransaction);
    }
  }
  catch(error)
  {
    res.status(500).json({message: 'Error fetching the transactions'})
  }
});

//adding/creating a customer payment transaction
router.put('/payment/:customer_id', upload.none() ,isEmployee ,async (req:Request, res:Response) => 
{
  try
  {
    console.log('roleee:::::', req.userRole);
    const newPaymentTransaction =  req.body;
    const transaction = await Transaction.findOne({customer_id: req.params.customer_id});
    
    if(!transaction)
    {
      return res.status(404).json({ message:'There is no such transaction.' });
    }

    transaction.paymentTransactions.push(newPaymentTransaction);

    await transaction.save();
    res.status(201).json(transaction)
  }
  catch(error)
  {
    res.status(500).json({message:'Server error'});
  }
});

//adding/creating a customer loan transaction
router.put('/loan/:customer_id', verifyToken,
[
  check('amount','Amount field cannot be empty.').notEmpty(),
  check('loanTerm', 'Loan Term is Required.').notEmpty(),
  check('interestRate', 'Interest Rate is Required.').notEmpty(),
  check('date', 'Date is required').not().isEmpty(),
  check('repaymentSchedule', 'Repayment Schedule is Required').notEmpty(),
]
,upload.none() ,async(req:Request, res:Response) =>
{
  const error = validationResult(req.body);
  
  if (!error.isEmpty())
  {
    return res.status(400).json({ errors: error.array() })
  }

  try 
  {
    const newLoanTransaction = req.body;
    const transaction = await Transaction.findOne({customer_id: req.params.customer_id});
    console.log('new Loan::::::', newLoanTransaction)
    //if there are existing transaction, send error message
    if(!transaction)
    {
      return res.status(400).json({message: 'No customer transaction found.'});
    }

    //check the role of whoever create this loan
    //if user  is not admin or employee, then it should be self created loan and loan approval will be "Pending"
    const userRole = req.userRole;
    if(userRole === UserRole.EMPLOYEE || userRole === UserRole.ADMIN)
    {
      newLoanTransaction.employee_admin_approval = "Approved";
      newLoanTransaction.status = "Active";
    }
    else
    {
      newLoanTransaction.employee_admin_approval = "Pending";
      newLoanTransaction.status = "Inactive";
    }

    console.log(req.userRole)
    newLoanTransaction.interestRate = parseInt(req.body.interestRate) / 100;

    transaction.loanTransactions.push(newLoanTransaction); // add the new loan to db
    console.log("Transaction:::: ",transaction.loanTransactions)
    await transaction.save();
    //send back the updated customer info with the added loan
    return res.status(201).json(transaction);

  }
  catch (error) {
    return res.status(500).json({message: 'Server Error.'});
  }
});





export {router as transactionRouter}