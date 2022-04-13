import { ButtonHTMLAttributes } from "react";

export enum BaseColors {
  GREEN,
  BLACK,
}
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  baseColor: BaseColors;
  disabled?: boolean;
}

const styles = {
  base: "flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium shadow-sm text-white",
  [BaseColors.GREEN]: {
    enabled:
      "bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2",
    disabled: "cursor-not-allowed bg-lime-600/80",
  },
  [BaseColors.BLACK]: {
    enabled:
      "bg-neutral-800 hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2",
    disabled: "cursor-not-allowed bg-neutral-700/95",
  },
};

const Button = ({
  children,
  onClick,
  disabled = false,
  baseColor = BaseColors.GREEN,
  ...otherProps
}: Props): JSX.Element => {
  const style = `${styles.base} ${
    !disabled ? styles[baseColor].enabled : styles[baseColor].disabled
  }`;

  return (
    <button
      className={style}
      onClick={onClick}
      disabled={disabled}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default Button;
