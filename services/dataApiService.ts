import { GitHubRepository, SensitiveInfoUser, User } from "types";

const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID_GITHUB;
const GITHUB_CLIENT_SECRET = process.env.CLIENT_SECRET_GITHUB;

const mapFromGithubDataToGithubRepositories = (
  data: Array<any>
): GitHubRepository[] =>
  data.map<GitHubRepository>((item: any) => ({
    id: item.id,
    name: item.name,
    owner: {
      username: item.owner.login,
      avatarUrl: item.owner.avatar_url,
      htmlUrl: item.owner.html_url,
    },
    htmlUrl: item.html_url,
    description: item.description,
  }));

const getOwnGithubRepositories = async (
  username: User["githubUsername"],
  token: SensitiveInfoUser["githubToken"]
): Promise<GitHubRepository[]> => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    return mapFromGithubDataToGithubRepositories(data);
  } catch (e) {
    console.error(e);
    return [];
  }
};

const getPublicGithubRepositories = async (): Promise<GitHubRepository[]> => {
  try {
    const auth =
      "Basic " +
      Buffer.from(GITHUB_CLIENT_ID + ":" + GITHUB_CLIENT_SECRET).toString(
        "base64"
      );

    const response = await fetch(`https://api.github.com/repositories`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: auth,
      },
    });

    const data = await response.json();
    return mapFromGithubDataToGithubRepositories(data);
  } catch (e) {
    console.error(e);
    return [];
  }
};

export default { getOwnGithubRepositories, getPublicGithubRepositories };
