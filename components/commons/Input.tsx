import React, { InputHTMLAttributes } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/solid";

export enum Types {
  EMAIL = "email",
  PASSWORD = "password",
}

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  type: Types;
  label: string;
  onHandleChange: (value: string) => void;
  error?: string;
}

const style = {
  valid:
    "appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-lime-500 focus:ring-lime-500 ",
  error:
    "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500",
};

const Input = ({
  id,
  label,
  onHandleChange,
  error,
  ...otherProps
}: Props): JSX.Element => {
  const onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    onHandleChange(e.currentTarget.value);
  };

  const showError = error && error.length > 0;
  return (
    <div className="mb-7 h-16">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          className={`block w-full rounded-md focus:outline-none sm:text-sm ${
            error ? style.error : style.valid
          }`}
          onChange={onChange}
          {...otherProps}
        />
        {showError ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        ) : null}
      </div>
      {showError ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
};

export default Input;
