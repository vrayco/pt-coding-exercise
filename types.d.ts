export interface Credentials {
  email: string;
  password: string;
}

export interface User extends Credentials {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
}

export type NonSensitiveInfoUser = Omit<User, "password">;

interface ApiResponse<T, E = { message: string }> {
  data?: T;
  errors?: E[];
}

export type SiginApiResponse = ApiResponse<NonSensitiveInfoUser>;
