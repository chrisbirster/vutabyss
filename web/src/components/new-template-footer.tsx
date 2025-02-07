import { css } from "@linaria/core";
import { useNavigate } from "@solidjs/router";
import { Setter, Show, createSignal } from "solid-js";
import { TemplateEditorModal } from "./template-editor-modal";
import { useSubmission } from "@solidjs/router";
import { createTemplate } from "@/api";

const footerStyle = css`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const cancelButtonStyle = css`
  background: #ccc;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
`;

const saveButtonStyle = css`
  background: #007bff;
  color: #fff;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
`;

type NewTempelateFooterProps = {
  template: string;
  onEdit: Setter<string>;
}

export const NewTemplateFooter = (props: NewTempelateFooterProps) => {
  const submission = useSubmission(createTemplate);
  const navigate = useNavigate();
  const [showModal, setShowModal] = createSignal(false);

  function onCancel() {
    navigate("/app/templates");
  }

  function openModal() {
    setShowModal(true)
  }

  function handleModalSave(updated: string) {
    props.onEdit(updated);
    setShowModal(false);
  }

  return (
    <>
      <div class={footerStyle}>
        <button type="button" class={cancelButtonStyle} onClick={onCancel}>
          Cancel
        </button>
        <button type="button" class={cancelButtonStyle} onClick={openModal}>
          Edit Template
        </button>
        <button
          class={saveButtonStyle}
          type="submit"
          disabled={submission.pending}
        >
          {submission.pending ? "Creating Templates..." : "Create Template"}
        </button>
      </div>
      <Show when={showModal()}>
        <Show when={showModal()}>
          <TemplateEditorModal
            initialTemplate={props.template}
            onCancel={() => setShowModal(false)}
            onSave={handleModalSave}
          />
        </Show>
      </Show>
    </>
  )
}
