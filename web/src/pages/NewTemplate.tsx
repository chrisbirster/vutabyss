import { css } from "@linaria/core";
import { onMount } from "solid-js";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const container = css`
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 500px;
`;

const header = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export default function AnkiCardEditor() {
  let frontEditor!: HTMLDivElement;
  let backEditor!: HTMLDivElement;

  onMount(() => {
    new Quill(frontEditor, { theme: "snow" });
    new Quill(backEditor, { theme: "snow" });
  });

  return (
    <div class={container}>
      <div class={header}>
        <span>Type: Basic</span>
        <span>Deck: My Deck</span>
      </div>
      <label>Front</label>
      <textarea />
      <label>Back</label>
      <textarea />
      <div class={header}>
        <button>Add</button>
        <button>Close</button>
      </div>
    </div>
  );
}
