import { ThemeColors } from "@/enums/theme-colors.enum";
import clsx from "clsx";

export interface BadgeProps {
  status: ThemeColors;
  text: string;
}

export const Badge = ({ status, text }: BadgeProps) => {
  const config = {
    [ThemeColors.PRIMARY]: ["text-blue-400", "bg-blue-100"],
    [ThemeColors.SECONDARY]: ["text-gray-400", "bg-gray-100"],
    [ThemeColors.SUCCESS]: ["text-green-400", "bg-green-100"],
    [ThemeColors.WARNING]: ["text-orange-400", "bg-orange-100"],
    [ThemeColors.DANGER]: ["text-red-400", "bg-red-100"],
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium",
        config[status],
      )}
    >
      {text}
    </span>
  );
};
