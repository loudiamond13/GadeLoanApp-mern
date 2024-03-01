export enum UserRole
{
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  EMPLOYEE = 'employee'
};


export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 2).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${month}-${day}-${year}`;
}