import { createSignal, For, createEffect, onMount, onCleanup, Show } from "solid-js";
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

  &.dirty:invalid {
    border-color: red;
    background-color: #ffe6e6;
  }
`;

const inputErrorStyle = css`
  position: relative;
  color: red;
  font-size: 12px;
  margin-top: 4px;
  z-index: 10;
`;

const initialTemplateText = `
{{define "Example"}}
<h1>{{.TemplateName}}</h1>
  {{block "CardFront" .}}{{end}}
  {{block "CardBack" .}}{{end}}
{{end}}

{{define "CardFront"}}
  <div>
    <h1>Question:</h1>
    {{range .Fields}}
      <p>{{.Name}}</p>
    {{end}}
  </div>
{{end}}

{{define "CardBack"}}
  <div>
    <h1>Answer:</h1>
    {{range .Fields}}
      <p>{{.Name}}</p>
    {{end}}
  </div>
{{end}}
`;


type InputError = { id: string, name: string, error: string }

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
  const [fieldError, setFieldError] = createSignal<InputError[]>([]);
  const [nameError, setNameError] = createSignal("");
  const [isTouched, setIsTouched] = createSignal(false);
  const [cardTemplate, setCardTemplate] = createSignal(initialTemplateText);

  function showError(input: HTMLInputElement) {
    if (input.validity.valueMissing) {
      setNameError("(*) You need to enter a deck name.");
    } else if (input.validity.patternMismatch) {
      setNameError("(*) Deck name must contain at least one letter.");
    } else {
      setNameError("(*) Invalid input.");
    }
  }

  const handleInput = async (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    setIsTouched(true);
    if (input.validity.valid) {
      setNameError("");
    } else {
      showError(input)
    }
  };

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
    // Check validity of the form
    setIsTouched(true)
    const formValid = formRef.checkValidity();
    console.log("Form valid: ", formValid);
    console.log("Event: ", event);
    console.log("Fields state: ", fields());
    if (!formValid) {
      event.preventDefault();
      // Find invalid fields and log them
      let ie: InputError[] = [];
      const invalidFields = Array.from(formRef.elements).forEach((el) => {
        if (el instanceof HTMLInputElement && !el.validity.valid) {
          ie.push({ id: el.id, name: el.name, error: el.validationMessage })
        }
      });

      setFieldError(ie)
      console.log("Invalid fields: ", invalidFields);
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
          <form ref={formRef} method="post" action={createTemplate} noValidate>
            <h3>Template Details</h3>
            <label for="templateName">Name of your template</label>
            <input
              name="templateName"
              class={inputField}
              required
              spellcheck={false}
              placeholder="Template name"
              onInput={handleInput}
              classList={{ dirty: isTouched() }}
              onBlur={() => setIsTouched(true)}
            />
            <Show when={nameError}>
              <span class={inputErrorStyle}>{nameError()}</span>
            </Show>
            <label for="templateDescription">Template Description</label>
            <input
              name="templateDescription"
              class={inputField}
              spellcheck={false}
              placeholder="(Optional) A description about this template"
            />
            <input type="hidden" name="cardTemplate" value={cardTemplate()} />
            <h3>Template Fields</h3>
            <For each={fields()}>
              {(field) => <Field field={field} setFields={setFields} />}
            </For>
            <Show when={fieldError()}>
              <For each={fieldError()}>
                {(err) => <p class={inputErrorStyle}>{err.name}: {err.error}</p>}
              </For>
            </Show>
            <NewTemplateAddFieldButton onSelect={handleAddField} />
            <NewTemplateFooter template={cardTemplate} onEdit={setCardTemplate} />
          </form>
        </div>
      </div>
    </div>
  );
}
