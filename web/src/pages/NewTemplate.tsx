import { createSignal, For, createEffect, onMount, onCleanup } from "solid-js";
import { css } from "@linaria/core";
import { NewTemplateFieldButton } from "@/components/NewTemplateFieldButton";
import { NewTemplateFooter } from "@/components/new-template-footer";
import { TField, FieldType } from "@/types";
import { isFieldData, fieldTypes } from "@/components/field-data";
import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Field } from "@/components/field";

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
    console.log("newestId added: ", newId);
    console.log("newestId ft: ", ft);
    setFields((old) => [
      ...old,
      {
        id: newId,
        name: "",
        type: ft,
        gearMenuOpen: false,
      },
    ]);
  }

  /**
   * Validates the form on submission. If invalid, prevents the default submit,
   * marks the form fields as "touched" for styling, displays the specific error
   * for the name field, and provides a general message to prompt the user to fix errors.
   */
  const handleSubmit = (event: SubmitEvent) => {
    // if the form is invalid cancel submission and show errors
    if (!formRef.checkValidity()) {
      event.preventDefault();
    }
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
          <form method="post" action={createTemplate}>
            <For each={fields()}>{(field) => <Field field={field} />}</For>
            <NewTemplateFieldButton onSelect={handleAddField} />
            <NewTemplateFooter onSave={handleSubmit} />
          </form>
        </div>
      </div>
    </div>
  );
}
