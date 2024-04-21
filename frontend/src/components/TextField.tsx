import { Field } from "@/types/catalog.type";
import { InputHTMLAttributes } from "react";
import { Input } from "./Input";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  field: Field;
}

const TextField = ({ field, ...props }: TextFieldProps) => {
  return (
    <div className="space-y-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-2 sm:py-5">
      <div>
        <label
          htmlFor={field.slug}
          className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
        >
          {field.title}
        </label>
        {field.required && (
          <span className="text-sm leading-6 text-gray-500" id="field-required">
            Required
          </span>
        )}
      </div>
      <div className="sm:col-span-2">
        <Input
          {...props}
          id={field.slug}
          placeholder={field.placeholder}
          defaultValue={field.default}
          required={field.required}
          aria-describedby="field-required"
          type={props.type}
          inputMode={props.inputMode}
        />
      </div>
    </div>
  );
};

export default TextField;
