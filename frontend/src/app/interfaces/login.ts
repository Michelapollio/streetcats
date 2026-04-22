export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}
