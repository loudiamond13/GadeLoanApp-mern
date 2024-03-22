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
  await page.locator(`[name=email]`).fill("test_customer_register_8257@example.com");
  await page.locator(`[name=password]`).fill("123456");

  await page.getByRole('button',{ name:'Sign In' }).click();

  await expect(page.getByText(`Signed in Successfully!`)).toBeVisible();

  //expects the headers
  await expect(page.getByRole(`link`, {name: `Home`})).toBeVisible();
  //expects the headers
  await expect(page.getByRole(`button`, {name: `Log out`})).toBeVisible();
});


//test_customer_register_8257@example.com
test('customer should be able to request a loan', async({page})=>
{
  await page.goto(UI_URL);

  //expect heading
  await expect(page.getByRole('heading', {name: `WELCOME TO YOUR DASHBOARD,`})).toBeVisible();

  //click the request loan button
  await page.getByRole(`link`, {name: 'Request Loan'}).click();

  //expect the header
  await expect(page.getByRole(`heading`, {name: `Request Loan`})).toBeVisible();

  //set loan
  await page.locator(`[name='amount']`).fill(`15000.00`);


  await page.getByRole(`button`, {name: 'Request Loan'}).click();

  //expect the toaster to be successful
  await expect(page.getByText(`Loan requested successfully.`)).toBeVisible();
});

test('customer should be able to view and pay their loans', async({page})=>
{
  await page.goto( `${UI_URL}`);

  //expect heading
  await expect(page.getByRole('heading', {name: `WELCOME TO YOUR DASHBOARD,`})).toBeVisible();

  //click the request loan button
  await page.getByRole(`link`, {name: 'View Loans'}).click();

  //expect a header
  await expect(page.getByRole(`heading`, {name: `Loan Payments`})).toBeVisible();

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