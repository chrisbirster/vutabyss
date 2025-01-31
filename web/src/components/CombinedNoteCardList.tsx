import { css } from "@linaria/core";
import { CombinedCard } from "@/types";
import { For } from "solid-js";
import { CreateNoteCard } from "./CreateNoteCard";
import { EditableNoteCard } from "./EditableNoteCard";

const cardList = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 80vh;
  overflow-y: auto;
  width: 100%;
  overflow-x: hidden;
`;

type NoteCardListProps = {
  cards?: CombinedCard[];
};

export const CombinedNoteCardList = (props: NoteCardListProps) => {
  return (
    <div class={cardList}>
      <CreateNoteCard />
      <For each={props.cards}>
        {(card) => (
          <EditableNoteCard
            card={card}
          />
        )}
      </For>
    </div>
  );
}

