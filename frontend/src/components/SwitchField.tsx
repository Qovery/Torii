import { Field } from "@/types/catalog.type";
import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { Controller, useFormContext } from "react-hook-form";

interface SwitchFieldProps {
  field: Field;
}

export default function SwitchField({ field }: SwitchFieldProps) {
  const { control } = useFormContext();

  let defaultValue = false;

  if (field.default.toLowerCase() === "true") {
    defaultValue = true;
  }

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
        <Controller
          control={control}
          name={field.slug as string}
          defaultValue={defaultValue}
          render={({ field: { value, onChange } }) => (
            <Switch.Group
              as="div"
              className="flex items-center justify-between"
            >
              <span className="flex flex-grow flex-col">
                <Switch.Description as="span" className="text-sm text-gray-500">
                  {field.description}
                </Switch.Description>
              </span>
              <Switch
                id={field.slug}
                name={field.slug}
                checked={value}
                onChange={(v) => {
                  if (onChange) {
                    onChange(v);
                  }
                }}
                className={clsx(
                  value ? "bg-indigo-600" : "bg-gray-200",
                  "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
                )}
              >
                <span
                  aria-hidden="true"
                  className={clsx(
                    value ? "translate-x-5" : "translate-x-0",
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  )}
                />
              </Switch>
            </Switch.Group>
          )}
        />
      </div>
    </div>
  );
}
