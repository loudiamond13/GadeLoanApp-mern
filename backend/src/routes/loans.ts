import express,{Request, Response} from "express";
import verifyToken, { isAdmin, isEmployee } from "../middleware/auth";
import { check, validationResult } from "express-validator";
import Loan, { LoanType } from "../models/loanModel";
import { LoanStatus, UserRole } from "../utilities/constants";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_API_KEY as string);


import multer from "multer";
import Customer from "../models/customerModel";
const upload = multer();

const router = express.Router();


router.post('/:customer_id', upload.none(), verifyToken, [
  check('amount', 'Amount field cannot be empty.').notEmpty(),
  check('loanTerm', 'Loan Term is Required.').notEmpty(),
  check('interestRate', 'Interest Rate is Required.').notEmpty(),
  check('date', 'Date is required').not().isEmpty(),
  check('paymentSchedule', 'Repayment Schedule is Required').notEmpty(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); 
  }

  try {
    const newLoanData = req.body;
  
    // Generate payment transactions(pre calculated)
    const paymentTransactions = [];
    const paymentSchedule = newLoanData.paymentSchedule;
    const loanTerm = parseInt(newLoanData.loanTerm);
    const interestRate = parseFloat(newLoanData.interestRate)/100; // convert  to decimal
    const amountWithInterest = parseFloat(((newLoanData.amount) * (1 + interestRate)).toFixed(2));
    
    //if payment schedule is biweekly, divide the amountWithInterest to two for amountPerDue 
    const amountPerDue = paymentSchedule === 'Bi-weekly' ? 
                        parseFloat(((amountWithInterest/loanTerm) / 2).toFixed(2)) 
                      : parseFloat((amountWithInterest / loanTerm).toFixed(2));

    const startDate = new Date(newLoanData.date);


    // if payment schedule is biweekly, multiply the term to 2
    const NumberOfPayments = paymentSchedule === 'Bi-weekly' ? loanTerm * 2 : loanTerm;
    
    for (let i = 0; i < NumberOfPayments; i++) 
    {
      const paymentDate = new Date(startDate);

      if (paymentSchedule === 'Bi-weekly') 
      {
        paymentDate.setDate(paymentDate.getDate() + (i + 1) * 14); // Add 14 days for each payment
      } 
      else if (paymentSchedule === 'Monthly') 
      {
        paymentDate.setMonth(paymentDate.getMonth() + i + 1); // Add 1 month for each payment
      }

      paymentTransactions.push({
        amount: amountPerDue,
        dueDate: paymentDate,
        transactionType: 'Pay',
        status: 'Unpaid',
        paidDate: null,
        stripePaymentId: '',
      });
    }

    
    // Update newLoanData with paymentTransactions
    newLoanData.paymentTransactions = paymentTransactions;

    // Check if customer exists
    const customer = await Customer.findOne({ _id: req.params.customer_id });
    if (!customer) {
      return res.status(400).json({ message: 'Customer not found.' });
    }

    // Set employee/admin approval and status based on user role
    const userRole = req.userRole;
    if (userRole === UserRole.EMPLOYEE || userRole === UserRole.ADMIN) {
      newLoanData.status = 'Approved';
    } else {
      newLoanData.status = 'Pending';
    }


       // Create and save the new loan
    const loanData: LoanType = {
    ...newLoanData,
    interestRate: interestRate,
    amountWithInterest: amountWithInterest.toFixed(2),
    customer: customer,
    };

    // Create and save the new loan
    const loan = new Loan(loanData);
    
    await loan.save();

    return res.status(201).json(loan); 
  } 
  catch (error) 
  {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


//gets  all loans for a specific customer by their ID
router.get('/:customer_id', verifyToken, async (req: Request, res: Response) => {
  try 
  {
    let { pageNum, status } = req.query;

    const query: any = { customer: req.params.customer_id };

    // Add status filter if provided
    if (status && ['Approved', 'Pending', 'Paid', 'Declined', 'Canceled', 'Refunded'].includes(status as string)) {
        query.status = status;
    }

    const pageSize = 5;  //page size
    const page = pageNum ? parseInt(pageNum.toString()) : 1; // set the default page number to page 1

    const skip = (page - 1) * pageSize;
    const totalCount = await Loan.countDocuments(query).populate('customer', 'firstName lastName');

    let loans = await Loan.find(query);


    //customized sorting 
    loans.sort((a: LoanType, b: LoanType) => {
      const statusPriority: { [key: string]: number } = {
        'Refunded': 6,
        'Canceled': 5,
        'Paid':     4,
        'Declined': 3,
        'Pending':  2,
        'Approved': 1,
      };
  
      const priorityA = statusPriority[a.status] || 0; // Use 0 if status is not defined in priority
      const priorityB = statusPriority[b.status] || 0;
  
      //lower numeric value will be more prioritized
      //if priorityA - priorityB will be positive. This indicates that loan B has a higher priority than loan A
      ////if priorityA - priorityB will be negative. This indicates that loan A has a higher priority than loan B
      return priorityA - priorityB;
    });


    // apply pagination
    loans = loans.slice(skip, skip + pageSize);

    return res.status(200).json({
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize), // Calculate the total number of pages
        currentPage: page,
        loans,
      });

  } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
  }
});


 //get  a single loan payment by id 
 router.get('/:customer_id/payment/:paymentTransaction_id', verifyToken, async(req:Request,res:Response)=>
 {
   try 
   {
     const customer_id = req.params.customer_id;
     const paymentTransaction_id = req.params.paymentTransaction_id;

     // find the transaction document matching the customer_id and paymentTransaction_id
     const loan = await Loan.findOne(
       {
         customer: customer_id, 
         'paymentTransactions._id': paymentTransaction_id
       },
       {
         'paymentTransactions.$': 1 // Projection to return only the matching payment transaction
       }
     );

     if (!loan) 
     {
       res.status(404).json({message:'No Payment Found.'});
     }
     return res.status(200).json(loan?.paymentTransactions[0]);
   } 
   catch (error) 
   {
     return res.status(500).json({message: 'Internal Server Error.'})  
   }
 });

//creates payment intent
router.post('/:customer_id/payment-intent/:paymentTransaction_id', verifyToken, async(req: Request, res:Response)=>
{
  try 
  {
    const customer_id = req.params.customer_id;
    const paymentTransaction_id = req.params.paymentTransaction_id;

    const customer = await Customer.findOne({ _id : customer_id });
    
    if(!customer)
    {
      return res.status(404).json({message: 'No Customer Found.'});
    }
    
   // find the transaction document matching the customer_id and paymentTransaction_id
   const loan = await Loan.findOne(
      {
        customer: customer._id, 
        'paymentTransactions._id': paymentTransaction_id
      },
      {
        'paymentTransactions.$': 1 // Projection to return only the matching payment transaction
      }
    );

    // if payment transaction found
    if (loan) 
    {
      let loanPayment = loan.paymentTransactions[0]

      //process the payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount: parseFloat((loanPayment.amount * 100).toFixed(2)),
        currency: "usd",
        metadata:{
          paymentTransaction_id: loanPayment._id,
          user_id: req.userId,
          customer_id: customer_id,
        },
      }); 

      //check if creating payment intent  was successful or not
      if(!paymentIntent.client_secret)
      {
        return res.status(500).json({message: 'Error on creating Payment Intent'})
      }
      //if  successfull
      else
      {
        //construct the response
        const response =
        {
          paymentIntent_id: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
          message:'Payment Intent Created',
          totalPaid: loanPayment.amount,
        }
        return res.status(200).json(response);
      }
    } 
    else 
    {
        // Loan not found
      return res.status(404).json({ message: 'Loan not found.' });
    }

  } 
  catch (error) 
  {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

//payment
router.post('/:customer_id/payment/:paymentTransaction_id',verifyToken, async (req:Request,res:Response) =>
{
  
  try  
  {
    const customer_id = req.params.customer_id;
    const paymentTransaction_id = req.params.paymentTransaction_id;
    const {paymentIntent_id} = req.body;

    // find the payment transaction document matching the customer_id and paymentTransaction_id
    const loan = await Loan.findOne({
        customer: customer_id, 
        'paymentTransactions._id': paymentTransaction_id
      },
      {
        'balance': 1, 
        "totalPayment": 1,
        'customer': 1, // include the customer_id
        'paymentTransactions.$': 1 // Projection to return only the matching payment transaction
    });

    if(!loan)
    {
      return res.status(404).json({message: 'No Loan Payment Found.'});
    }

    //retrieve the paymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntent_id);

    if (!paymentIntent) {
      return res.status(400).json({ message: "Payment intent not found" });
    }

    if(paymentIntent.metadata.customer_id !== loan.customer._id.toString())
    {
      return res.status(400).json({message:"Payment intent do not match."});
    }

    if(paymentIntent.status !== 'succeeded')
    {
      return res.status(400).json({message: `Payment failed. Status: ${paymentIntent.status}.`});
    }

    // Update the specific payment transaction within the array
    const updatedLoan =  await Loan.findOneAndUpdate(
      { 
        customer: customer_id, 
        'paymentTransactions._id': paymentTransaction_id 
      },
      {
        $set: {
          'paymentTransactions.$.status': 'Paid',
          'paymentTransactions.$.paidDate': new Date(),
          'paymentTransactions.$.stripePaymentId': paymentIntent.id,
        }
      }
    );

    if(!updatedLoan)
    {
      return res.status(404).json({message: 'Error on updating payment transaction.'});
    }

    //update the total loan payment of the loan
    updatedLoan.totalPayment +=  parseFloat((paymentIntent.amount / 100).toFixed(2)); 

    await updatedLoan?.save()

    return res.status(200).json({message: 'Loan Payment Successful!'});
  } 
  catch (error) 
  {
    return res.status(500).json({message: 'Internal Server Error.'})  
  }
});


//loan approval
router.put('/approval/:loan_id',isEmployee, upload.none() ,async(req: Request, res: Response)=>
{
  try 
  {
    let {interestRate} = req.body;
    interestRate = parseFloat(interestRate) / 100; //convert the interestRate to decimal/percentage
    

    const loan = await Loan.findOne({_id:  req.params.loan_id});
    
    //check if loan exists
    if(!loan)
    {
      return res.status(404).json({message: 'Loan not found.'});
    }

  
    //check if the interestRate has been modified
    if(loan.interestRate !== interestRate && !isNaN(interestRate))
    {
      //make sure interest rate is between 0-100
      if(interestRate <= 1 && interestRate >= 0)
      {
        //if modified, update the interest Rate and amount with interest
        loan.interestRate =  interestRate;
        loan.amountWithInterest = parseFloat(((loan.amount) * (1 + interestRate)).toFixed(2));
      }
      else
      {
        return res.status(400).json({ message: 'Invalid interest rate provided.' });
      }
    }

    //update the loan date and status
    loan.date = new Date();
    loan.status = 'Approved';
    
    await loan.save();

    return res.status(200).json({message: 'Loan  Approved!'});
  } 
  catch (error) {
    return res.status(500).json({message: 'Internal Server Error.'});
  }
});

//refund loan
router.put('/refund/:loan_id', isEmployee, async(req:Request,res:Response)=>
{
  try 
  {
    const loan = await Loan.findOne({_id: req.params.loan_id});
    
    //check if loan exists
    if(!loan) 
    {
      return res.status(404).json({message:'Loan not found.'});
    }

    //check if loan has payment made
    if(loan.totalPayment > 0)
    {
      // iterate through all payments
      for(const paymentTransaction of loan.paymentTransactions)
      {
        // check  if transaction has paymentIntent id to check if it has made a payment successfully
        if(paymentTransaction.stripePaymentId !== '')
        {
          try 
          {
            //process the refund
            const stripeRefund = await stripe.refunds.create({
              payment_intent: paymentTransaction.stripePaymentId,
              amount: paymentTransaction.amount * 100
            });
           
            //update the status of the paymentTransactions
            paymentTransaction.status = 'Refunded'
            //update the total payment record
            loan.totalPayment  -= paymentTransaction.amount; 
           
          } 
          catch (error) {
            return res.status(500).json({message: 'Error on proccessing refund.'});
          }
        }
      }

      // Save changes to the payment transaction
      loan.status = 'Refunded'
      await loan.save();
      return res.status(200).json({message: 'Loan canceled and refund.'});
    }
  } 
  catch (error) 
  {
    return res.status(500).json({message: 'Internal Server Error.'});
  }
});

//cancel a loan
router.put('/cancel/:loan_id', isEmployee, async(req: Request, res:Response)=>
{
  try 
  {
    const loan = await Loan.findOne({_id:  req.params.loan_id});

    //check if loan exists in db
    if(!loan)
    {
      return res.status(404).json({message: 'No Loan Found.'});
    }

    loan.status = 'Canceled';
    await loan.save();
    return res.status(200).json({message: 'Loan canceled.'});
  } 
  catch (error) 
  {
    return res.status(500).json({message:'Internal Server Error'});  
  }
});

//decline a loan
router.put('/decline/:loan_id', isEmployee, async(req:Request,res: Response)=>
{
  try 
  {
    const loan = await Loan.findOne({_id: req.params.loan_id});
    
    //check if loan exists in db
    if(!loan)
    {
      return res.status(404).json({message: 'No Loan Found.'});
    }

    //change the loan status to decline.
    loan.status = 'Declined';
    await loan.save();
    return res.status(200).json({message: 'Loan Declined.'});

  } 
  catch (error) 
  {
    return res.status(500).json({message: 'Internal Server Error.'})
  }
});


//count  number of loans with Pending status for loan requests badge number (NavBar)
router.get('/loan-requests/count', isEmployee, async(req:Request,res:Response)=>
{
  try 
  {
    const count = await Loan.countDocuments({status:"Pending"});
    return res.status(200).send(count.toString());
  } 
  catch (error) 
  {
    return res.status(500).json({message: 'Internal Server Error.'});
  }
});

//get all loans with pending status for loan requests 
router.get('/customers/loan-request', isEmployee , async(req:Request,res:Response)=>
{
  try
  {
    //search and pagination parameters
    const {pageNum,search} = req.query;
    
    let query: any = {status: LoanStatus.PENDING};


    //if there is search do the query/searching
    if(search)
    {
      query.$or = 
      [
        //search for lastname, firstname, and email,  case insensitive
        {firstName: {$regex: new RegExp(search as string, 'i')}},
        {lastName: {$regex: new RegExp(search as string, 'i')}},
        {email: {$regex: new RegExp(search as string, 'i')}}
      ]
    };

    const pageSize = 10;
    const page = pageNum ? parseInt(pageNum.toString()) : 1; //set the default page number to 1

    const skip = (page - 1) * pageSize; //number of items to be skipped

    //count documents
    const totalCount = await Loan.countDocuments(query);


    //getting the loans, populate customer fields
    const loans = await Loan.find(query).populate('customer', 'firstName lastName email')
                                        .skip(skip)
                                        .limit(pageSize)
                                        .sort({date: -1});


    //check if there is loan with status Pending
    if (!loans) {
      return res.status(404).json({ message: 'No loans with pending status found' });
    }

  
    return res.status(200).json({
                            totalCount,
                            totalPages: Math.ceil(totalCount/pageSize),
                            currentPage: page,
                            loans,
                      });

  } 
  catch (error) 
  {
    return res.status(500).json({message: 'Internal Server Error.'});
  }
});

export {router as loanRouter};