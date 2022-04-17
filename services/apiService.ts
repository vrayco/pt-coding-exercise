import { ApiResponse, Credentials, User } from "types";

const parseAndBuildResponse = async <T>(response: Response): Promise<T> => {
  const { data, errors }: ApiResponse<T> = await response.json();

  if (response.ok && data) {
    return Promise.resolve(data);
  } else {
    const error = new Error(
      errors?.map((e) => e.message).join("\n") ?? "unknown"
    );
    return Promise.reject(error);
  }
};

export { parseAndBuildResponse };
