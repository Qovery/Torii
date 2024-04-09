import { Field } from "@/types/catalog.type";
import TextField from "./TextField";
import TextareaField from "./TextareaField";
import SwitchField from "./SwitchField";

export interface DynamicFieldProps {
  field: Field;
}

export function DynamicField({ field }: DynamicFieldProps) {
  if (field.type === "text") {
    return <TextField key={field.slug} field={field} />;
  } else if (field.type === "number") {
    return <TextField key={field.slug} field={field} inputMode="numeric" />;
  } else if (field.type === "textarea") {
    return <TextareaField key={field.slug} field={field} />;
  } else if (field.type === "boolean") {
    return <SwitchField key={field.slug} field={field} />;
  }

  return <p>'{field.type}' is not a supported field</p>;
}
