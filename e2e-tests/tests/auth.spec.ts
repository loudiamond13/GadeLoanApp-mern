import { test, expect } from '@playwright/test';
import path from 'path';

const UI_URL = 'http://localhost:5173/';


test('should allow customer to register', async({page}) => {
  const testEmail = `test_customer_register_${Math.floor(Math.random() * 9999)}@example.com`;
  await page.goto(UI_URL);

  //click register
  await page.click(`text=Register`);

  //expect the header
  await expect(page.getByRole('heading', {name: 'Register'})).toBeVisible();

  //fill the fields
  await page.locator(`[name='firstName']`).fill(`Test`);
  await page.locator(`[name='lastName']`).fill('Customer');
  await page.locator(`[name='email']`).fill(testEmail);
  await page.locator(`[name='streetAddress1']`).fill('Test Address street');
  await page.locator(`[name='streetAddress2']`).fill('Apartment 1');
  await page.locator(`[name='city']`).fill('Test City');
  await page.locator(`[name='state']`).fill('Test State');
  await page.locator(`[name='postalCode']`).fill('63366');
  await page.locator(`[name='dob']`).fill('2000-08-19');
  await page.locator(`[name='phoneNumber']`).fill('636-312-7379');
  await page.selectOption(`select[name='gender']`, 'Female');
  await page.locator(`[name='password']`).fill('123456');
  await page.locator(`[name='confirmPassword']`).fill('123456');

  await page.setInputFiles('[name="imageFile"]', path.join(__dirname, 'files', 'image1.jpg'));

  //submit form
  await page.getByRole('button', {name: "Register"}).click();

  //expect the toaster
  await expect(page.getByText(`Successfully Registered.`)).toBeVisible();

  //expect the Home nav-link
  await expect(page.getByRole(`link`, {name: `Home`})).toBeVisible();

  //expect the log out button
  await expect(page.getByRole(`button`, {name: `Log out`})).toBeVisible();

  //expect the email verification message
  await expect(page.getByRole('heading', {name: 'Please verify your email'})).toBeVisible();

});



test('should allow the customer to sign in', async ({ page }) => {
  

  await page.goto(UI_URL);

  // Click on "Sign In" button
  await page.click('text=Sign In');


  await expect(page.getByRole('heading', {name: 'Sign In'})).toBeVisible();

  //fill the password and email for test
  await page.locator(`[name=email]`).fill("slinkyman127@gmail.com");
  await page.locator(`[name=password]`).fill("123456");

  await page.getByRole('button',{ name:'Sign In' }).click();

  await expect(page.getByText(`Signed in Successfully!`)).toBeVisible();
  await expect(page.getByRole(`link`, {name: `Home`})).toBeVisible();
  await expect(page.getByRole(`button`, {name: `Log out`})).toBeVisible();
  
});

test('Should allow admin to log in', async({page})=> 
{
  await page.goto(UI_URL);

  // Click on "Sign In" button
  await page.click(`text=Sign In`);


  await expect(page.getByRole('heading', {name: 'Sign In'})).toBeVisible();

  //fill the password and email for test
  await page.locator(`[name=email]`).fill("wawa@gmail.com");
  await page.locator(`[name=password]`).fill("123456");

  await page.getByRole('button',{ name:'Sign In' }).click();

  await expect(page.getByText(`Signed in Successfully!`)).toBeVisible();

  //expects the headers
  await expect(page.getByRole(`link`, {name: `Home`})).toBeVisible();
  await expect(page.getByRole('link', { name: 'Customers', exact: true })).toBeVisible();
  await expect(page.getByRole(`link`, {name: `Loan Requests`, exact:true})).toBeVisible();
  await expect(page.getByRole(`link`, {name: `Users`, exact: true})).toBeVisible();

  //expect the log out button
  await expect(page.getByRole(`button`, {name: 'Log out'})).toBeVisible();
});

test('should allow user to register as admin', async({page})=>{
  const testEmail = `test_admin_register_${Math.floor(Math.random() * 9999)}@example.com`;
  await page.goto(UI_URL);

  await page.getByRole(`link`, {name:'Register as Admin'} ).click() ;

  //expect
  await expect(page.getByText(`Create An Account`)).toBeVisible();

  //fill the input
  await page.locator(`[name=firstName]`).fill('John');
  await page.locator(`[name=lastName]`).fill('Doe');
  await page.locator(`[name=email]`).fill(testEmail);
  await page.locator(`[name=password]`).fill(`password123`);
  await page.locator(`[name=confirmPassword]`).fill(`password123`);

  await page.getByRole('button',{name: `Create Account`}).click();

  await expect(page.getByText(`Registration Successful!`)).toBeVisible();

  await expect(page.getByRole(`link`, {name: `Home`})).toBeVisible();
  await expect(page.getByRole('link', { name: 'Customers', exact: true })).toBeVisible();
  await expect(page.getByRole(`link`, {name: `Loan Requests`, exact:true})).toBeVisible();
  await expect(page.getByRole(`link`, {name: `Users`, exact: true})).toBeVisible();
  await expect(page.getByRole(`button`, {name: `Log out`})).toBeVisible();
});