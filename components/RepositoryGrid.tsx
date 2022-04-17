import React from "react";
import { GitHubRepository } from "types";
import RepositoryCard from "./RepositoryCard";

type Props = {
  data: GitHubRepository[];
};

const RepositoryGrid = ({ data }: Props): JSX.Element => (
  <ul
    role="list"
    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
  >
    {data.map((repository) => (
      <RepositoryCard key={repository.id} repository={repository} />
    ))}
  </ul>
);

export default RepositoryGrid;
