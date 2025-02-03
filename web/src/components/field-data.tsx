import { FieldType } from "@/types";
import {
  ToggleLeft,
  Calendar,
  Mail,
  File,
  Braces,
  PencilLine,
  Hash,
  Link
} from "lucide-solid";

import { Field } from "@/types";

const fieldDataKey = Symbol('field');

export type TFieldData = {
  [fieldDataKey]: true;
  fieldId: Field['id'];
};

export function getFieldData(field: Field): TFieldData {
  return { [fieldDataKey]: true, fieldId: field.id };
}

export function isFieldData(data: Record<string | symbol, unknown>): data is TFieldData {
  return data[fieldDataKey] === true;
}

export const fieldTypes: FieldType[] = [
  { id: 'field-type-0', logo: PencilLine, label: "Plain text" },
  { id: 'field-type-1', logo: Hash, label: "Number" },
  { id: 'field-type-2', logo: ToggleLeft, label: "Bool" },
  { id: 'field-type-3', logo: Mail, label: "Email" },
  { id: 'field-type-4', logo: Link, label: "URL" },
  { id: 'field-type-5', logo: Calendar, label: "DateTime" },
  { id: 'field-type-6', logo: File, label: "File" },
  { id: 'field-type-7', logo: Braces, label: "JSON" },
];

export function getFieldTypes() {
  return fieldTypes;
}
