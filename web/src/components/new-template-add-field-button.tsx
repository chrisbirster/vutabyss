import { createSignal, Show } from "solid-js";
import { css } from "@linaria/core";
import { FieldTypeMenu } from "@/components/FieldTypeMenu";
import { FieldType } from "@/types";

const buttonRow = css`
  position: relative;
  margin-bottom: 24px;
  width: 100%;
  container: newFieldParent / inline-size;
`;

const newFieldButton = css`
  padding: 8px 12px;
  background: #eee;
  border: 1px solid #ccc;
  cursor: pointer;
  border-radius: 4px;
  width: 100%;
`;
type NewTemplateFieldButtonProps = {
  onSelect: (ft: FieldType) => void;
}

export const NewTemplateAddFieldButton = (props: NewTemplateFieldButtonProps) => {
  const [showFieldMenu, setShowFieldMenu] = createSignal(false);

  const handleSelect = (ft: any) => {
    props.onSelect(ft)
    setShowFieldMenu(!showFieldMenu())
  }
  return (
    <div class={buttonRow}>
      <button
        type="button"
        onClick={() => setShowFieldMenu(!showFieldMenu())}
        class={newFieldButton}
      >
        + New field
      </button>
      <Show when={showFieldMenu()}>
        <FieldTypeMenu onSelect={handleSelect} />
      </Show>
    </div>
  )
}
