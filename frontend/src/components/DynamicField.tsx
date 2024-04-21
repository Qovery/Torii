import { Field } from "@/types/catalog.type";
import SwitchField from "./SwitchField";
import TextField from "./TextField";
import TextareaField from "./TextareaField";

export interface DynamicFieldProps {
  field: Field;
  initialFocus?: {
    name: string;
  };
}

export function DynamicField({ field, initialFocus }: DynamicFieldProps) {
  const focused = initialFocus?.name === field.slug;

  if (field.type === "text") {
    return <TextField field={field} focused={focused} />;
  } else if (field.type === "number") {
    return <TextField field={field} inputMode="numeric" focused={focused} />;
  } else if (field.type === "textarea") {
    return <TextareaField field={field} focused={focused} />;
  } else if (field.type === "boolean") {
    return <SwitchField field={field} />;
  }

  return <p>'{field.type}' is not a supported field</p>;
}

export default DynamicField;
