import { test, expect } from '@playwright/test';

const UI_URL = 'http://localhost:5173/';

test.beforeEach(async({page}) => 
{
  await page.goto(UI_URL);

  // Click on "Sign In" button
  await page.click('text=Sign In');


  await expect(page.getByRole('heading', {name: 'Sign In'})).toBeVisible();

  //fill the password and email for test
  //log in as admin
  await page.locator(`[name=email]`).fill("wawa@gmail.com");
  await page.locator(`[name=password]`).fill("123456");

  await page.getByRole('button',{ name:'Sign In' }).click();

  await expect(page.getByText(`Signed in Successfully!`)).toBeVisible();

  //expects the headers
  await expect(page.getByRole(`link`, {name: `Home`})).toBeVisible();
  await expect(page.getByRole('link', { name: 'Customers', exact: true })).toBeVisible();
  await expect(page.getByRole(`link`, {name: `Loan Requests`, exact:true})).toBeVisible();
  await expect(page.getByRole(`link`, {name: `Users`, exact: true})).toBeVisible();

  await expect(page.getByRole(`button`, {name: `Log out`, exact: true})).toBeVisible();


});



test('Should allow the admin/employee to  make a loan', async({page}) =>
{
  await page.goto( `${UI_URL}`);
  
  await page.getByRole(`link`, {name: 'Customers', exact: true}).click();

  await expect(page.getByRole(`button`, {name: `Search`})).toBeVisible();
 
  //click the loan button
  await page.getByText('Make a Loan').first().click();

  //expect the header
  await expect(page.getByRole(`heading`, {name: `Create Customer Loan`})).toBeVisible();

  //set loan
  await page.locator(`[name='amount']`).fill(`15000.00`);



  await page.getByRole(`button`, {name: 'Process Loan'}).click();

  //expect the toaster to be successful
  await expect(page.getByText(`Loan proccessed successfully.`)).toBeVisible();
});

test('Should allow the admin/employee to make a payment for a customer', async({page}) =>
{
  await page.goto( `${UI_URL}`);
  
  await page.getByRole(`link`, {name: 'Customers', exact: true}).click();

  await expect(page.getByRole(`button`, {name: `Search`})).toBeVisible();

  //click the payment button
  await page.getByText('Make Payment').first().click();


  //click the first accordion that is active
  await page.getByRole(`heading`, {name: 'Active'}).first().click();

  //click pay now
  await page.getByRole(`link`, {name: 'Pay now'}).first().click();

  //expect the heading
  await expect(page.getByRole(`heading`, {name: `Payment Details`})).toBeVisible();

  //get the first iframe and fill the card number, mm/yy, cvv fields and zip for the card info
  const stripeFrame = page.frameLocator("iframe").first();
  await stripeFrame.locator('[placeholder="Card number"]').fill("4242424242424242");
  await stripeFrame.locator('[placeholder="MM / YY"]').fill("04/30");
  await stripeFrame.locator('[placeholder="CVC"]').fill("424");
  await stripeFrame.locator('[placeholder="ZIP"]').fill("42424");

  //click the payment button
  await page.click('text=Confirm Payment');
  await page.dblclick('text=Confirm Payment');
  await page.dblclick('text=Confirm Payment');
  await page.dblclick('text=Confirm Payment');

  //expect the payment to be successful
  await expect(page.getByText(`Payment successful`)).toBeVisible();

});

test(`admin/employee should be able to view customer loan list`, async({page})=>
{
  await page.goto( `${UI_URL}`);
  
  await page.getByRole(`link`, {name: 'Customers', exact: true}).click();

  await expect(page.getByRole(`button`, {name: `Search`})).toBeVisible();

  //click the payment button
  await page.getByText('View Loans').first().click();

  await expect(page.getByText(`Customer Loans`)).toBeVisible();

  await expect(page.getByRole('button', {name: `Filter`})).toBeVisible();

});


test(`admin/employee should be able to edit customer loan list`, async({page})=>
{
  await page.goto( `${UI_URL}`);
  
  await page.getByRole(`link`, {name: 'Customers', exact: true}).click();

  await expect(page.getByRole(`button`, {name: `Search`})).toBeVisible();

  //click the payment button
  await page.getByText('Edit Customer').first().click();

  await expect(page.getByRole('heading', {name: `Edit Customer`})).toBeVisible();

  await page.locator(`[name=firstName]`).fill("Test");

  await page.locator(`[name=lastName]`).fill("Customer");

  await page.getByText('Update Customer').click();
  

  //expect the update/edit to be successful
  await expect(page.getByText(`The customer has been updated.`)).toBeVisible();

});



