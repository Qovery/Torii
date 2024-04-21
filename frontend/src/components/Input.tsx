import { InputHTMLAttributes, useEffect } from "react";
import { useFormContext } from "react-hook-form";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  focused?: boolean;
}

export const Input = ({ label, focused, ...props }: InputProps) => {
  const { register, setFocus } = useFormContext();

  useEffect(() => {
    if (focused && props.id) {
      setFocus(props.id);
    }
  }, [props.id, setFocus, focused]);

  return (
    <div className="space-y-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-2 sm:py-5">
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
        >
          {label}
        </label>
      )}
      <div className="sm:col-span-3">
        <input
          {...props}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          {...register(props.id as string)}
        />
      </div>
    </div>
  );
};
