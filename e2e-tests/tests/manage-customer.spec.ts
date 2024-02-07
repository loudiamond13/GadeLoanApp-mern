import { test, expect } from '@playwright/test';
import path from 'path';

const UI_URL = 'http://localhost:5173/';

test.beforeEach(async({page}) => 
{
  await page.goto(UI_URL);

  // Click on "Sign In" button
  await page.getByRole(`link`, {name: 'Sign In'}).click();


  await expect(page.getByRole('heading', {name: 'Sign In'})).toBeVisible();

  //fill the password and email for test
  await page.locator(`[name=email]`).fill("asd@sssgmail.com");
  await page.locator(`[name=password]`).fill("1234567");

  await page.getByRole('button',{ name:'Sign In' }).click();

  await expect(page.getByText(`Signed in Successfully!`)).toBeVisible();

  await expect(page.getByRole(`link`, {name: `Home`})).toBeVisible();
  await expect(page.getByRole(`link`, {name: `Creditor List`})).toBeVisible();
  await expect(page.getByRole(`link`, {name: `Create Customer`})).toBeVisible();
  await expect(page.getByRole(`button`, {name: `Log Out`})).toBeVisible();
});


test(`should allow user to add  a new creditor/customer with valid data`, async ({page})=>
{
  const testEmail = `test_register_${Math.floor(Math.random() * 9999)}@example.com`;

  await page.goto( `${UI_URL}`);
  
  await page.getByRole(`link`, {name: 'Create Customer'}).click();

  await page.locator(`[name='firstName']`).fill(`John`);
  await page.locator(`[name='lastName']`).fill('Doe');
  await page.locator(`[name='email']`).fill(testEmail);
  await page.locator(`[name='streetAddress']`).fill('Test Address street');
  await page.locator(`[name='barangay']`).fill('Test barangay');
  await page.locator(`[name='cityMunicipality']`).fill('Test municipality');
  await page.locator(`[name='province']`).fill('Test province');
  await page.locator(`[name='dob']`).fill('2000-08-19');
  await page.locator(`[name='phoneNumber']`).fill('091234567899');
  await page.selectOption(`select[name='sex']`, 'Female');
  await page.selectOption(`select[name='branch']`,'Carmen');

  await page.setInputFiles('[name="imageFile"]', path.join(__dirname, 'files', '1.jpg'));

  await page.getByRole('button', {name: "Create Customer"}).click();

  await expect(page.getByText(`Customer created successfully.`)).toBeVisible();
});