import { InformationCircleIcon } from "@heroicons/react/solid";

export enum AlertType {
  DANGER = "red",
  INFO = "blue",
}

type Props = {
  variant?: AlertType;
  children?: JSX.Element | JSX.Element[];
};

const Alert = ({
  variant = AlertType.DANGER,
  children,
}: Props): JSX.Element => {
  return variant === AlertType.DANGER ? (
    <div className={`mb-3 rounded-md bg-red-50 p-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            className={`h-5 w-5 text-red-400 `}
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className={`text-red}-700 text-sm`}>{children}</p>
        </div>
      </div>
    </div>
  ) : (
    <div className={`mb-3 rounded-md bg-blue-50 p-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            className={`h-5 w-5 text-blue-400 `}
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className={`text-sm text-blue-700`}>{children}</p>
        </div>
      </div>
    </div>
  );
};

export default Alert;
