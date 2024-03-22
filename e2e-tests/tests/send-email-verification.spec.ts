import { test, expect } from '@playwright/test';

const UI_URL = 'http://localhost:5173/';


test(`should allow user resend email  verification`, async ({ page }) => 
{
  await page.goto(UI_URL);

  // Click on "Sign In" button
  await page.click('text=Sign In');


  await expect(page.getByRole('heading', {name: 'Sign in', exact: true})).toBeVisible();

  //fill the password and email for test
  await page.locator(`[name=email]`).fill("wawa@gmail.com");
  await page.locator(`[name=password]`).fill("123456");

  await page.getByRole('button',{ name:'Sign In' }).click();

  await expect(page.getByText(`Signed in Successfully!`)).toBeVisible();

  await expect(page.getByRole(`link`, {name: `Home`})).toBeVisible();
  await expect(page.getByRole(`button`, {name: `Log out`})).toBeVisible();


  await page.getByRole(`link`, {name: 'Hello, admin Lou Loyloy'}).click();

  await page.getByRole(`link`, {name: 'Resend Verification Email.'}).first().click();

  await expect(page.getByText(`Email Verification Sent!`)).toBeVisible();
});