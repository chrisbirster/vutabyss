import { css } from "@linaria/core";
import { CombinedCard } from "@/types";
import { createSignal, createEffect, onCleanup } from "solid-js";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const card = css`
  position: relative;
  width: 100%;
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #2c2c54;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const content = css`
  word-wrap: break-word;
  margin-top: 8px;
`;

const controls = css`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
`;

const iconButton = css`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: #e0e0e0;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;
const spacer = css`
 margin-top: 16px;
`;

type NoteCardProps = {
  card: CombinedCard;
};

export const EditableNoteCard = (props: NoteCardProps) => {
  const [isEditing, setIsEditing] = createSignal(false);
  let editorRef: HTMLDivElement | undefined;
  let quill: Quill | undefined;

  const toggleEdit = (e: Event) => {
    e.stopPropagation();
    if (isEditing()) {
      // Save the edited content
      if (quill) {
        const editedContent = quill.root.innerHTML;
        // Implement save logic, e.g., send to API
        console.log(`Saving content for card ${props.card.card_id}:`, editedContent);
        // Optionally, update the card content in the UI
        // This might require lifting state up or using a store
      }
    }
    setIsEditing(!isEditing());
  };

  const handleCopy = (e: Event) => {
    e.stopPropagation();
    // Implement copy logic here
    const textToCopy = `${props.card.front_content} - ${props.card.back_content}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        console.log('Card content copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleDelete = (e: Event) => {
    e.stopPropagation();
    // TODO: implement delete logic here
    console.log(`Delete card ${props.card.card_id}`);
  };

  // Initialize Quill editor when editing starts
  createEffect(() => {
    if (isEditing() && editorRef) {
      quill = new Quill(editorRef, {
        theme: 'snow',
      });
      quill.root.innerHTML = props.card.front_content; // Example: editing front_content
    }
  });

  // Clean up Quill instance when editing ends
  createEffect(() => {
    if (!isEditing() && quill) {
      quill = undefined;
    }
  });

  onCleanup(() => {
    if (quill) {
      quill = undefined;
    }
  });

  return (
    <div class={card}>
      <div class={controls}>
        <button class={iconButton} onClick={toggleEdit} title="Edit">
          {/* Pencil Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-13-5l6-6m0 0l6 6m-6-6v12" />
          </svg>
        </button>
        <button class={iconButton} onClick={handleCopy} title="Copy">
          {/* Copy Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 16h6m-3-3v6m-6-6H8m6 0l3 3m-3-3l-3 3" />
          </svg>
        </button>
        <button class={iconButton} onClick={handleDelete} title="Delete">
          {/* Trashcan Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1m4-1a1 1 0 011 1v1m-4 0h4m-6 0h.01M9 12v6m6-6v6" />
          </svg>
        </button>
      </div>
      <strong>{props.card.front_content}</strong>
      <p class={content}>{props.card.back_content}</p>
      {isEditing() && (
        <div ref={editorRef} class={spacer}></div>
      )}
      {/* <span class={tag}>{props.card.note_type_name}</span> */}
    </div>
  );
};
