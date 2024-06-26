import { ThemeColors } from "@/enums/theme-colors.enum";
import clsx from "clsx";
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  color?: ThemeColors;
  loading?: boolean;
  flat?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}

export function Button({
  color = ThemeColors.PRIMARY,
  loading,
  flat,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const config: {
    [key in ThemeColors]: string;
  } = {
    [ThemeColors.PRIMARY]: flat
      ? "bg-transparent text-indigo-500"
      : "bg-indigo-500 hover:bg-indigo-700 text-white",
    [ThemeColors.SECONDARY]: flat
      ? "bg-transparent text-violet-500"
      : "bg-violet-500 hover:bg-violet-700 text-white",
  };

  return (
    <button
      {...props}
      className={clsx(
        "inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:ml-3 sm:w-auto",
        config[color],
        disabled && "cursor-not-allowed !bg-gray-300 !text-gray-400",
        flat && "!shadow-none",
        props.className,
      )}
    >
      {loading ? <div>Loading...</div> : children}
    </button>
  );
}
