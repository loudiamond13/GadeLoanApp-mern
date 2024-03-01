import express,{Request, Response} from "express";
import verifyToken, { isEmployee } from "../middleware/auth";
import Transaction, { TransactionsType } from "../models/transactionModel";


import multer from "multer";
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


router.put('/payment/:customer_id', upload.none() ,isEmployee ,async (req:Request, res:Response) => 
{
  try
  {
    const updatedTransaction =  req.body;
    const transaction = await Transaction.findOne({customer_id: req.params.customer_id});
    
    if(!transaction)
    {
      return res.status(404).json({ message:'There is no such transaction.' });
    }

    console.log('asd ',req.userRole, req.body.date)

    transaction.paymentTransactions.push(updatedTransaction);

    await transaction.save();
    res.status(201).json(transaction)
  }
  catch(error)
  {
    res.status(500).json({message:'Server error'});
  }
});





export {router as transactionRouter}