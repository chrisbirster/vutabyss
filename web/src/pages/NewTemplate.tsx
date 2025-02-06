import { createSignal, For, createEffect, onMount, onCleanup } from "solid-js";
import { css } from "@linaria/core";
import { NewTemplateAddFieldButton } from "@/components/new-template-add-field-button";
import { NewTemplateFooter } from "@/components/new-template-footer";
import { TField, FieldType } from "@/types";
import { isFieldData, fieldTypes } from "@/components/field-data";
import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Field } from "@/components/field";
import { createTemplate } from "@/api";

const page = css`
  display: flex;
  flex-direction: column;
  padding: 24px;
  background-color: #e5b8b2;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  min-height: 100vh;
  width: 100%;
`;

const headerStyle = css`
  margin-bottom: 16px;
`;

const containerStyle = css`
  width: 600px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 16px;
`;

const fieldsContainerStyle = css`
  margin-bottom: 16px;
`;

const inputField = css`
  width: 100%;
  margin: 0 10px;
  border-radius: 8px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

export default function NewTemplate() {
  let formRef!: HTMLFormElement;
  const defaultFieldType = fieldTypes[0];
  let nextId = 0;
  const originField: TField =
  {
    id: ++nextId,
    name: "id",
    type: defaultFieldType,
    gearMenuOpen: false,
  };
  const [fields, setFields] = createSignal<TField[]>([originField]);

  createEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isFieldData(source.data);
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) {
          return;
        }

        const sourceData = source.data;
        const targetData = target.data;

        if (!isFieldData(sourceData) || !isFieldData(targetData)) {
          return;
        }

        const indexOfSource = fields().findIndex((field) => field.id === sourceData.fieldId);
        const indexOfTarget = fields().findIndex((fieldType) => fieldType.id === targetData.fieldId);

        if (indexOfTarget < 0 || indexOfSource < 0) {
          return;
        }

        const closestEdgeOfTarget = extractClosestEdge(targetData);

        setFields(
          reorderWithEdge({
            list: fields(),
            startIndex: indexOfSource,
            indexOfTarget,
            closestEdgeOfTarget,
            axis: 'vertical',
          }),
        );
        const element = document.querySelector(`[data-task-id="${sourceData.fieldId}"]`);
        if (element instanceof HTMLElement) {
          triggerPostMoveFlash(element);
        }
      },
    });
  });

  function handleAddField(ft: FieldType) {
    const newId = ++nextId;
    setFields((old) => [
      ...old,
      {
        id: newId,
        name: "",
        type: ft,
        gearMenuOpen: false,
      },
    ]);
    const newestFieldInput = formRef.elements.namedItem(`field-${nextId}-name`) as HTMLInputElement
    newestFieldInput.focus();
  }

  /**
   * Validates the form on submission. If invalid, prevents the default submit,
   * marks the form fields as "touched" for styling, displays the specific error
   * for the name field, and provides a general message to prompt the user to fix errors.
   */
  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault(); // Prevent default submission for debugging
    // Check validity of the form
    const formValid = formRef.checkValidity();
    console.log("Form valid: ", formValid);
    console.log("Event: ", event);
    console.log("Fields state: ", fields());
    if (!formValid) {
      // Find invalid fields and log them
      const invalidFields = Array.from(formRef.elements).filter((el) => {
        return el instanceof HTMLInputElement && !el.validity.valid;
      });

      console.log("Invalid fields: ", invalidFields);

      // Log specific validation messages
      invalidFields.forEach((field) => {
        if (field instanceof HTMLInputElement) {
          console.error(`Field ID: ${field.id}, Name: ${field.name}, Error: ${field.validationMessage}`);
        }
      });
    }

    // Proceed with existing form submission logic if valid
    // createTemplate(new FormData(formRef));
  };

  onMount(() => {
    formRef.addEventListener("submit", handleSubmit);
    onCleanup(() => {
      formRef.removeEventListener("submit", handleSubmit);
    });
  });

  return (
    <div class={page}>
      <h2 class={headerStyle}>New Template</h2>
      <div class={containerStyle}>
        <div class={fieldsContainerStyle}>
          <form ref={formRef} method="post" action={createTemplate} noValidate>
            <h3>Template Details</h3>
            <label for="templateName">Name of your template</label>
            <input
              name="templateName"
              class={inputField}
              required
              spellcheck={false}
              placeholder="Template name"
            />
            <label for="templateDescription">Template Description</label>
            <input
              name="templateDescription"
              class={inputField}
              spellcheck={false}
              placeholder="this"
            />
            <h3>Template Fields</h3>
            <For each={fields()}>{(field) => <Field field={field} setFields={setFields} />}</For>
            <NewTemplateAddFieldButton onSelect={handleAddField} />
            <NewTemplateFooter onSave={handleSubmit} />
          </form>
        </div>
      </div>
    </div>
  );
}
