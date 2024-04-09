import { Field } from "@/types/catalog.type";
import { DynamicField } from "./DynamicField";

export interface DynamicFieldsProps {
  fields: Field[];
  initialFocus?: {
    name: string;
    ref: React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  };
}

export function DynamicFields({ fields, initialFocus }: DynamicFieldsProps) {
  return fields.map((field) => (
    <DynamicField key={field.slug} field={field} initialFocus={initialFocus} />
  ));
}

export default DynamicFields;
