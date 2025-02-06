import { createSignal, onMount } from "solid-js";
import { css, cx } from "@linaria/core";
import { Portal } from "solid-js/web";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const backdropStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 999;
`;

const modalStyle = css`
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0,0,0,0.3);
  z-index: 1000;
  transform: translateX(100%);
  animation: slideIn 0.3s forwards;
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
  
  @keyframes slideIn {
    to {
      transform: translateX(0);
    }
  }
`;

const headerStyle = css`
  font-size: 20px;
  margin-bottom: 16px;
`;

const textareaStyle = css`
  flex-grow: 1;
  font-family: monospace;
  font-size: 14px;
  width: 100%;
  border: 1px solid #ccc;
  padding: 8px;
  box-sizing: border-box;
`;

const footerStyle = css`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;

const buttonStyle = css`
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
`;

const cancelButtonStyle = css`
  background: #ccc;
`;

const saveButtonStyle = css`
  background: #007bff;
  color: #fff;
`;

export interface TemplateEditorModalProps {
  initialTemplate: string;
  onSave: (e: SubmitEvent) => void;
  onCancel: () => void;
}

export function TemplateEditorModal(props: TemplateEditorModalProps) {
  const [templateContent, setTemplateContent] = createSignal(props.initialTemplate);

  onMount(() => {
    new Quill('#editor', {
      theme: 'snow'
    });
  })

  function handleSave(e: SubmitEvent) {
    props.onSave(e);
  }

  return (
    <Portal>
      {/* Backdrop that closes the modal when clicked */}
      <div class={backdropStyle} onClick={props.onCancel} />
      {/* Modal content */}
      <div class={modalStyle}>
        <div class={headerStyle}>Edit Template</div>
        <textarea
          id="editor"
          class={textareaStyle}
          value={templateContent()}
          onInput={(e) => setTemplateContent(e.currentTarget.value)}
        />
        <div class={footerStyle}>
          <button class={cx(buttonStyle, cancelButtonStyle)} onClick={props.onCancel}>
            Cancel
          </button>
          <button type="submit" class={cx(buttonStyle, saveButtonStyle)} onClick={(e) => handleSave(e)}>
            Save
          </button>
        </div>
      </div>
    </Portal>
  );
}
