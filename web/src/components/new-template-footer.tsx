import { css } from "@linaria/core";
import { useNavigate } from "@solidjs/router";
import { Show, createSignal } from "solid-js";
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
  onSubmit: (e: SubmitEvent) => void;
}

export const NewTemplateFooter = (props: NewTempelateFooterProps) => {
  const submission = useSubmission(createTemplate);
  const navigate = useNavigate();
  const [showModal, setShowModal] = createSignal(false);
  const initialTemplateText = `
{{/* Reverse Template */}}
{{define "ReverseTemplate"}}
{{reverse "templateName"}}
{{block "CardFront"}}
{{block "CardBack"}}
{{end}}

{{define "CardFront"}}
  <div>
    <h1>{{.name}}</h1>
    <p>ID: {{.id}}</p>
    {{if .extra}}<p>Extra: {{.extra}}</p>{{end}}
  </div>
{{end}}

{{/* Back of the card */}}
{{define "CardBack"}}
  <div>
    <p>Answer: {{.answer}}</p>
    <p>Reference: {{.url}}</p>
  </div>
{{end}}`;

  function onCancel() {
    navigate("/app/templates");
  }

  function onEdit() {
    setShowModal(true)
  }

  return (
    <>
      <div class={footerStyle}>
        <button type="button" class={cancelButtonStyle} onClick={onCancel}>
          Cancel
        </button>
        <button type="button" class={cancelButtonStyle} onClick={onEdit}>
          Edit Template
        </button>
        <button class={saveButtonStyle} type="submit" disabled={submission.pending}>
          {submission.pending ? "Creating Templates..." : "Create Template"}
        </button>
      </div>
      <Show when={showModal()}>
        <Show when={showModal()}>
          <TemplateEditorModal
            initialTemplate={initialTemplateText}
            onCancel={() => setShowModal(false)}
          />
        </Show>
      </Show>
    </>
  )
}
