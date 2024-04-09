import { Field } from "@/types/catalog.type";
import {
  InputHTMLAttributes,
  useEffect,
  forwardRef,
  ForwardedRef,
} from "react";
import { useFormContext } from "react-hook-form";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  field: Field;
}

const TextField = forwardRef(
  (
    { field, ...props }: TextFieldProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const { register, unregister } = useFormContext();

    useEffect(
      () => () => {
        unregister(field.slug);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    return (
      <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-2 sm:px-6 sm:py-5">
        <div>
          <label
            htmlFor={field.slug}
            className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
          >
            {field.title}
          </label>
          <span className="text-sm leading-6 text-gray-500" id="field-required">
            {field.required && "Required"}
          </span>
        </div>
        <div className="sm:col-span-2">
          <input
            {...register(field.slug)}
            {...props}
            ref={ref}
            name={field.slug}
            id={field.slug}
            placeholder={field.placeholder}
            defaultValue={field.default}
            required={field.required}
            aria-describedby="field-required"
            type={props.type}
            inputMode={props.inputMode}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    );
  }
);

export default TextField;
