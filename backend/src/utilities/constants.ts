export enum UserRole
{
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  EMPLOYEE = 'employee'
};


export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${month}-${day}-${year}`;
}

export function numberWithCommas(x: number | undefined): string {
  if (x === undefined) return ""; // Handle undefined case
  return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}