import { css } from "@linaria/core";

import "quill/dist/quill.snow.css";
import Quill from "quill";
import { onMount } from "solid-js";


const container = css`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const NoteCardTabCreateView = () => {
  onMount(() => {
    new Quill('#editor', {
      theme: 'snow'
    });
  })

  return (
    <div id="editor" class={container}>
      <p>Hello World!</p>
      <p>Some initial <strong>bold</strong> text</p>
      <p><br /></p>
    </div>
  );
}

