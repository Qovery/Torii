import { Field } from "@/types/catalog.type";
import SwitchField from "./SwitchField";
import TextField from "./TextField";
import TextareaField from "./TextareaField";

export interface DynamicFieldProps {
  field: Field;
  initialFocus?: {
    name: string;
    ref: React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  };
}

export function DynamicField({ field, initialFocus }: DynamicFieldProps) {
  const ref = initialFocus?.name === field.slug ? initialFocus.ref : undefined;

  if (field.type === "text") {
    return (
      <TextField
        key={field.slug}
        field={field}
        ref={ref as React.MutableRefObject<HTMLInputElement>}
      />
    );
  } else if (field.type === "number") {
    return (
      <TextField
        key={field.slug}
        field={field}
        inputMode="numeric"
        ref={ref as React.MutableRefObject<HTMLInputElement>}
      />
    );
  } else if (field.type === "textarea") {
    return (
      <TextareaField
        key={field.slug}
        field={field}
        ref={ref as React.MutableRefObject<HTMLTextAreaElement>}
      />
    );
  } else if (field.type === "boolean") {
    return <SwitchField key={field.slug} field={field} />;
  }

  return <p>'{field.type}' is not a supported field</p>;
}
