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

import { TField } from "@/types";

const fieldDataKey = Symbol('field');

export type TFieldData = {
  [fieldDataKey]: true;
  fieldId: TField['id'];
};

export function getFieldData(field: TField): TFieldData {
  return { [fieldDataKey]: true, fieldId: field.id };
}

export function isFieldData(data: Record<string | symbol, unknown>): data is TFieldData {
  return data[fieldDataKey] === true;
}

export const getInputProps = (fieldType: FieldType) => {
  switch (fieldType.id) {
    case "field-type-1": // Number
      return { type: "number", step: "any", pattern: "[0-9]+" };
    case "field-type-2": // Boolean (checkbox)
      return { type: "checkbox" };
    case "field-type-3": // Email
      return { type: "email", pattern: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$" };
    case "field-type-4": // URL
      return { type: "url", pattern: "https?://.+" };
    case "field-type-5": // DateTime
      return { type: "datetime-local" };
    case "field-type-6": // File Upload
      return { type: "file" };
    case "field-type-7": // JSON
      return { type: "text", pattern: "\\{.*\\}" }; // Simple regex for JSON
    default: // Default to plain text
      return { type: "text" };
  }
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
