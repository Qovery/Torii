import { Field } from "@/types/catalog.type";
import { DynamicField } from "./DynamicField";

export interface DynamicFieldsProps {
  fields: Field[];
}
export function DynamicFields({ fields }: DynamicFieldsProps) {
  return fields.map((field) => <DynamicField key={field.slug} field={field} />);
}

export default DynamicFields;
