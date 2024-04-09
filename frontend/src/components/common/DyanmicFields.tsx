import { Field } from "@/types/catalog.type";
import { DynamicField } from "./DynamicField";

export interface DyanmicFieldsProps {
  fields: Field[];
}
export function DyanmicFields({ fields }: DyanmicFieldsProps) {
  return fields.map((field) => <DynamicField key={field.slug} field={field} />);
}

export default DyanmicFields;
