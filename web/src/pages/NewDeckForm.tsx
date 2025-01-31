import { css, cx } from "@linaria/core";
import { createDeck } from "@/api";
import { createSignal, onMount, onCleanup, Show } from "solid-js";
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
`;

const invalidInput = css`
  border-color: red;
  background-color: #ffe6e6;
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


export default function NewDeck() {
  let formRef!: HTMLFormElement;
  let nameInputRef!: HTMLInputElement;
  let nameErrorRef!: HTMLSpanElement;
  const submission = useSubmission(createDeck)

  const [generalError, setGeneralError] = createSignal("");

  function showError(input: HTMLInputElement, errorElement: HTMLSpanElement) {
    if (input.validity.valueMissing) {
      // If empty
      errorElement.textContent = "You need to enter a deck name.";
    } else if (input.validity.patternMismatch) {
      // If it doesn't contain at least one letter
      errorElement.textContent = "Deck name must contain at least one letter.";
    } else {
      // Generic error message
      errorElement.textContent = "Invalid input.";
    }
    // Add the `active` class to display the error
    errorElement.classList.add(activeErrorBanner);
  }

  // Handle input events for real-time validation
  const handleInput = async (event: Event) => {
    event.NONE
    if (nameInputRef.validity.valid) {
      nameErrorRef.textContent = "";
      nameErrorRef.classList.remove("active");
    } else {
      showError(nameInputRef, nameErrorRef);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: SubmitEvent) => {
    if (!formRef.checkValidity()) {
      event.preventDefault();
      // If form is invalid, show general error
      setGeneralError("Please fix the errors in the form before submitting.");
      return;
    }
  }

  onMount(() => {
    nameInputRef.addEventListener("input", handleInput);
    formRef.addEventListener("submit", handleSubmit);
    onCleanup(() => {
      nameInputRef.removeEventListener("input", handleInput);
      formRef.removeEventListener("submit", handleSubmit);
    });
  });

  return (
    <div class={page}>
      <div class={container}>
        <form ref={formRef} action={createDeck} novalidate method="post">
          {/* Name Field */}
          <label for="name">Name of new deck</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter name ..."
            class={cx(inputField, nameErrorRef?.textContent && invalidInput)}
            required
            pattern="(?=.*[A-Za-z]).+"
            title="Deck name must contain at least one letter."
            ref={nameInputRef}
          />
          <span ref={nameErrorRef} class="error"></span>
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

          <Show when={generalError()}>
            <div class={cx(errorBanner, activeErrorBanner)}>
              {generalError()}</div>
          </Show>

          {/* Submit Button */}
          <button class={buttonPrimary} type="submit" disabled={submission.pending}>
            {submission.pending ? "Creating Deck..." : "Create Deck"}
          </button>
        </form>
      </div>
    </div >
  );
}
