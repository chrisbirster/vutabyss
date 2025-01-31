import { css } from "@linaria/core";
import { createDeck } from "@/api";
import { createDeckRequest } from "@/schema";
import { createSignal } from "solid-js/types/server/reactive.js";
import { onMount } from "solid-js";

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
`;

export default function NewDeck() {
  const [nameError, setNameError] = createSignal("");
  const [generalError, setGeneralError] = createSignal("");

  let formRef;
  let nameInputRef;
  let nameErrorRef;

  onMount(() => {
    const nameInput = nameInputRef;
    const nameError = nameErrorRef;

    // Handle input events for real-time validation
    const handleInput = (event) => {
      if (nameInput.validity.valid) {
        nameError.textContent = ""; // Clear error message
        nameError.classList.remove("active"); // Hide error
      } else {
        showError(nameInput, nameError);
      }
    };

    nameInput.addEventListener("input", handleInput);

    // Handle form submission
    const handleSubmit = (event) => {
      // If the name field is invalid, prevent form submission
      if (!nameInput.validity.valid) {
        showError(nameInput, nameError);
        setGeneralError("Please fix the errors in the form before submitting.");
        event.preventDefault();
      } else {
        // Clear any general errors
        setGeneralError("");
      }
    };

    formRef.addEventListener("submit", handleSubmit);

    // Clean up event listeners when the component unmounts
    onCleanup(() => {
      nameInput.removeEventListener("input", handleInput);
      formRef.removeEventListener("submit", handleSubmit);
    });
  });

  function showError(input, errorElement) {
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
    errorElement.classList.add("active");
  }

  // Parse and validate 
  const parsedData = createDeckRequest.safeParse({ name, description });
  if (!parsedData.success) {
    const errorMessages = parsedData.error.errors.map(err => err.message).join(" ");
    throw new Error(errorMessages);
  }

  const onSubmit = (evt: Event) => {
    evt.preventDefault();
    const formData = new FormData(evt.target);
  }

  return (
    <div class={page}>
      <div class={container}>
        <form action={createDeck} method="post">
          <label>Name of new deck</label>
          <input
            name="name"
            type="text"
            placeholder="Enter name ..."
            class={inputField}
          />
          <p>This is the name for your group of flashcards</p>
          <label>Description (optional)</label>
          <input
            name="description"
            type="text"
            placeholder="A deck for studying ..."
            class={inputField}
          />
          <p>Provide a useful description that distinguishes this deck from othere</p>
          <button class={buttonPrimary} type="submit">Create Deck</button>
        </form>
      </div>
    </div>
  );
}
