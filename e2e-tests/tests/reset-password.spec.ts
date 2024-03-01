import { expect, test } from '@playwright/test';

const UI_URL = 'http://localhost:5173/';


test('user/admind/employee should be able to forget password and send token/email link to user email', async({page}) =>
{
  await page.goto(UI_URL);

  await page.getByRole(`link`, {name: 'Sign In'}).click();

  await page.getByRole(`link`, {name: 'Forgot Password?'}).click();

  await page.locator(`[name=email]`).fill("slinkyman127@gmail.com");

  await page.getByRole('button',{ name:'Forgot Password' }).click();

  await expect(page.getByText(`Check your email to reset password.`)).toBeVisible();

});