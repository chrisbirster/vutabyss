import { css, cx } from "@linaria/core";
import { createDeck } from "@/api";
import { createSignal, onMount, onCleanup, Show, createEffect } from "solid-js";
import { useSubmission } from "@solidjs/router";

const page = css`
  display: flex;
  padding: 24px;
  background-color: #e5b8b2;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  min-height: 100vh;
  width: 100%;
`;

const container = css`
  border-radius: 8px;
  background-color: #ccc;
  padding: 20px;
  max-width: 50%;
`;

const inputField = css`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;

  &.dirty:invalid {
    border-color: red;
    background-color: #ffe6e6;
  }
`;

const buttonPrimary = css`
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  border-radius: 8px;
  background: #4a1e79;
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;

  &:disabled {
    background: #a29bfe;
    cursor: not-allowed;
  }
`;

const errorBanner = css`
  color: red;
  background-color: #ffe6e6;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid red;
  border-radius: 4px;
  display: none;
`;

const activeErrorBanner = css`
  display: block;
`;

const spanError = css`
  color: red;
`;

export default function NewDeck() {
  const submission = useSubmission(createDeck);
  const [generalError, setGeneralError] = createSignal("");
  const [showGeneralError, setShowGeneralError] = createSignal(false);
  const [isTouched, setIsTouched] = createSignal(false);
  const [nameError, setNameError] = createSignal("");

  // TODO: Better way to do this? Handles the general error not being evaluated reactively 
  createEffect(() => {
    nameError() ? setShowGeneralError(true) : setShowGeneralError(false)
  })

  let formRef!: HTMLFormElement;
  let nameInputRef!: HTMLInputElement;

  function showError(input: HTMLInputElement) {
    if (input.validity.valueMissing) {
      setNameError("(*) You need to enter a deck name.");
    } else if (input.validity.patternMismatch) {
      setNameError("(*) Deck name must contain at least one letter.");
    } else {
      setNameError("(*) Invalid input.");
    }
  }

  /**
   * validate name field
   */
  const handleInput = async () => {
    setIsTouched(true);
    if (nameInputRef.validity.valid) {
      setNameError("");
    } else {
      showError(nameInputRef);
    }
  };

  /**
   * Validates the form on submission. If invalid, prevents the default submit,
   * marks the form fields as "touched" for styling, displays the specific error
   * for the name field, and provides a general message to prompt the user to fix errors.
   */
  const handleSubmit = (event: SubmitEvent) => {
    // if the form is invalid cancel submission and show errors
    if (!formRef.checkValidity()) {
      event.preventDefault();
      setIsTouched(true)
      showError(nameInputRef);
      setGeneralError("Please fix the errors in the form before submitting.");
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
      <div class={container}>
        <form ref={formRef} noValidate action={createDeck} method="post">
          {/* Name Field */}
          <label for="name">Name of new deck</label>
          <input
            ref={nameInputRef}
            class={inputField}
            classList={{ dirty: isTouched() }}
            id="name"
            name="name"
            type="text"
            placeholder="Enter name ..."
            required
            pattern="(?=.*[A-Za-z]).+"
            title="Deck name must contain at least one letter."
            onInput={handleInput}
            onBlur={() => setIsTouched(true)}
          />
          <Show when={spanError}>
            <span class={spanError}>{nameError()}</span>
          </Show>
          <p>This is the name for your group of flashcards</p>

          {/* Description Field */}
          <label for="description">Description (optional)</label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder="A deck for studying ..."
            class={inputField}
          />
          <p>Provide a useful description that distinguishes this deck from others</p>

          <Show when={showGeneralError()}>
            <div class={cx(errorBanner, activeErrorBanner)}>
              {generalError()}
            </div>
          </Show>

          {/* Submit Button */}
          <button
            class={buttonPrimary}
            type="submit"
            disabled={submission.pending}
          >
            {submission.pending ? "Creating Deck..." : "Create Deck"}
          </button>
        </form>
      </div>
    </div>
  );
}
