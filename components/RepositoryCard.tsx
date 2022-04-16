import { ExternalLinkIcon, UserIcon } from "@heroicons/react/solid";
import Image from "next/image";
import Link from "next/link";
import { GitHubRepository } from "types";

type Props = {
  repository: GitHubRepository;
};

const RepositoryCard = ({ repository }: Props): JSX.Element => (
  <li
    key={repository.id}
    className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
  >
    <div className="flex w-full items-center justify-between space-x-6 p-6">
      <div className="flex-1 truncate">
        <div className="flex items-center space-x-3">
          <h3 className="truncate text-sm font-medium text-gray-900">
            {repository.owner.username}
          </h3>
          <span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
            Owner
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">{repository.name}</p>
        <p className="mt-1 truncate text-sm text-gray-400">
          {repository.description}
        </p>
      </div>
      <Image
        className="h-10 w-10 rounded-full"
        src={repository.owner.avatarUrl}
        alt={repository.owner.username}
        height={64}
        width={64}
      />
    </div>
    <div>
      <div className="-mt-px flex divide-x divide-gray-200">
        <div className="flex w-0 flex-1">
          <Link href={repository.owner.htmlUrl}>
            <a
              target="_blank"
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <span className="ml-3">User profile</span>
            </a>
          </Link>
        </div>
        <div className="-ml-px flex w-0 flex-1">
          <Link href={repository.htmlUrl}>
            <a
              target="_blank"
              className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              <ExternalLinkIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span className="ml-3">Repository</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  </li>
);

export default RepositoryCard;
