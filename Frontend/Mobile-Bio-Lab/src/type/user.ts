export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city?: string;   // optional in case backend doesn't always send it
  role: string;
  status?: string; // pending | approved | rejected
}
