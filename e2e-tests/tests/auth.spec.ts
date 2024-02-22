import { test, expect } from '@playwright/test';

const UI_URL = 'http://localhost:5173/';

test('should allow the user to sign in', async ({ page }) => {
  

  await page.goto(UI_URL);

  // Click on "Sign In" button
  await page.getByRole(`link`, {name: 'Sign In'}).click();


  await expect(page.getByRole('heading', {name: 'Sign In'})).toBeVisible();

  //fill the password and email for test
  await page.locator(`[name=email]`).fill("wawa@gmail.com");
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
  await page.getByRole(`link`, {name: 'Sign In'}).click();


  await expect(page.getByRole('heading', {name: 'Sign In'})).toBeVisible();

  //fill the password and email for test
  await page.locator(`[name=email]`).fill("wawa@gmail.com");
  await page.locator(`[name=password]`).fill("123456");

  await page.getByRole('button',{ name:'Sign In' }).click();

  await expect(page.getByText(`Signed in Successfully!`)).toBeVisible();

  await expect(page.getByRole(`link`, {name: `Home`})).toBeVisible();
  await expect(page.getByRole(`link`, {name: `Customers`})).toBeVisible();
  await expect(page.getByRole(`link`, {name: `Create Employee`})).toBeVisible();
  await expect(page.getByRole(`button`, {name: `Log out`})).toBeVisible();
});

test('should allow user to register as admin', async({page})=>{
  const testEmail = `test_register_${Math.floor(Math.random() * 9999)}@example.com`;
  await page.goto(UI_URL);

  await page.getByRole(`link`, {name:'Register'} ).click() ;

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
  await expect(page.getByRole(`link`, {name: `Customers`})).toBeVisible();
  await expect(page.getByRole(`link`, {name: `Create Employee`})).toBeVisible();
  await expect(page.getByRole(`button`, {name: `Log out`})).toBeVisible();

});