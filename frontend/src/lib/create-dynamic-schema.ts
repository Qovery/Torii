import { Field } from "@/types/catalog.type";
import * as yup from "yup";

export type FieldSchema =
  | yup.BooleanSchema
  | yup.StringSchema
  | yup.NumberSchema;

/**
 * Creates a dynamic schema from an array of field
 * to be used inside of the execute service flow
 * @param {Field[]} fields
 * @returns {yup.AnyObject}
 */
export const createDynamicSchema = <T>(
  fields: Field[]
): yup.AnyObjectSchema => {
  const schema: Record<keyof T, FieldSchema> = {} as Record<
    keyof T,
    FieldSchema
  >;

  for (const field of fields as Field[]) {
    if (field.required) {
      switch (field.type) {
        case "boolean":
          schema[field.slug as keyof T] = yup.boolean().required();
          break;
        case "number":
          schema[field.slug as keyof T] = yup.number().required();
          break;
        default:
          schema[field.slug as keyof T] = yup.string().required();
          break;
      }
    } else {
      switch (field.type) {
        case "boolean":
          schema[field.slug as keyof T] = yup.boolean();
          break;
        case "number":
          schema[field.slug as keyof T] = yup.number();
          break;
        default:
          schema[field.slug as keyof T] = yup.string();
          break;
      }
    }
  }

  return yup.object(schema);
};
