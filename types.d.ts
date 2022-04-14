export interface User {
  id: number;
  email: string;
  name: string;
  avatarUrl?: string;
  githubUsername?: string;
}

export interface SensitiveInfoUser extends User {
  password: string;
  githubToken?: string;
}

type NewUser = Omit<User, "id"> & Partial<SensitiveInfoUser>;

type Credentials = Pick<SensitiveInfoUser, "email" | "password">;

export interface GitHubRepository {
  id: number;
  name: string;
  owner: {
    username: string;
    avatarUrl: string;
    htmlUrl: string;
  };
  htmlUrl: string;
  description: string;
}

interface ApiResponse<T, E = { message: string }> {
  data?: T;
  errors?: E[];
}

export type SiginApiResponse = ApiResponse<User>;
export type GithubRepositoriesApiResponse = ApiResponse<GitHubRepository[]>;
