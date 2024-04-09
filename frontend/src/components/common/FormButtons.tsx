import { ThemeColors } from "@/enums/theme-colors.enum";
import { Button } from "./Button";

export interface FormButtonsProps {
  valid: boolean;
  onCancel?: () => void;
}

export function FormButtons({ valid, onCancel }: FormButtonsProps) {
  return (
    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
      <Button type="submit" color={ThemeColors.PRIMARY} disabled={!valid}>
        Validate
      </Button>
      {onCancel && (
        <Button
          type="button"
          flat
          color={ThemeColors.PRIMARY}
          onClick={onCancel}
        >
          Close
        </Button>
      )}
    </div>
  );
}
