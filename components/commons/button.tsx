import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  disabled?: boolean;
}

const style = {
  enabled:
    "flex w-full justify-center rounded-md border border-transparent bg-lime-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2",
  disabled:
    "flex w-full cursor-not-allowed justify-center rounded-md border border-transparent bg-lime-600/80 py-2 px-4 text-sm font-medium text-white shadow-sm",
};

const Button = ({
  label,
  onClick,
  disabled = false,
  ...otherProps
}: Props): JSX.Element => (
  <button
    className={!disabled ? style.enabled : style.disabled}
    onClick={onClick}
    disabled={disabled}
    {...otherProps}
  >
    {label}
  </button>
);

export default Button;
