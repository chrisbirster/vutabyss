import { For } from "solid-js";
import { css } from "@linaria/core";
import { FieldType } from "@/types";
import { fieldTypes } from "./field-data";

const fieldMenuStyle = css`
  position: absolute;
  top: 40px;
  left: 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  @container newFieldParent (min-width: 500px) {
    gap: 12px; /* bigger gap if there's enough space */
    background: #fefefe;
  }
`;

const menuItemStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background: #f2f2f2;
  }
`;

type FieldTypeMenuProps = {
  onSelect: (fieldType: FieldType) => void;
}

export const FieldTypeMenu = (props: FieldTypeMenuProps) => {
  return (
    <div class={fieldMenuStyle}>
      <For each={fieldTypes}>
        {(field) => (
          <div class={menuItemStyle} onClick={() => props.onSelect(field)}>
            <span>{<field.logo />}</span>
            <span>{field.label}</span>
          </div>
        )}
      </For>
    </div>
  );
}

