export interface LoginResponse {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  password?: string;
}