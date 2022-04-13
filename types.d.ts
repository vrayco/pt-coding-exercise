export interface User {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;
}

export interface SensitiveInfoUser extends User {
  password: string;
  githubToken?: string;
}

type Credentials = Pick<SensitiveInfoUser, "email" | "password">;

type NewUser = Omit<User, "id"> & Partial<SensitiveInfoUser>;

const a: NewUser = {};
interface ApiResponse<T, E = { message: string }> {
  data?: T;
  errors?: E[];
}

export type SiginApiResponse = ApiResponse<User>;
