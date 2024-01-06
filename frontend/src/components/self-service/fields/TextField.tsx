import {InputHTMLAttributes} from "react";

interface Props {
  field: any;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
}

export default function TextField({field, inputMode}: Props) {

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
          {field.required && 'Required'}
        </span>
      </div>
      <div className="sm:col-span-2">
        <input
          type="text"
          name={field.slug}
          id={field.slug}
          placeholder={field.placeholder}
          defaultValue={field.default}
          required={field.required}
          aria-describedby="field-required"
          inputMode={inputMode}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  )
}
