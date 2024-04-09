import { Field } from "@/types/catalog.type";
import {
  TextareaHTMLAttributes,
  useEffect,
  forwardRef,
  ForwardedRef,
} from "react";
import { useFormContext } from "react-hook-form";

interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  field: Field;
}

const TextareaField = forwardRef(
  (
    { field, ...props }: TextareaFieldProps,
    ref: ForwardedRef<HTMLTextAreaElement>
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
      <div className="space-y-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-2 sm:py-5">
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
          <textarea
            {...register(field.slug)}
            {...props}
            ref={ref}
            id={field.slug}
            name={field.slug}
            rows={3}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            defaultValue={field.default}
          />
          <p className="mt-3 text-sm leading-6 text-gray-600">
            {field.description}
          </p>
        </div>
      </div>
    );
  }
);

export default TextareaField;
