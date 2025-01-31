import { css } from "@linaria/core";
import { CardDetails } from "@/types";
import { For } from "solid-js";
import { NoteCard } from "@/components/NoteCard";
import { CreateNoteCard } from "./CreateNoteCard";
import { useParams } from "@solidjs/router";

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
  cards?: CardDetails[];
  selectedCard?: CardDetails;
  onSelectedCard: (note_id: number) => void;
};

export const NoteCardList = (props: NoteCardListProps) => {
  const params = useParams();
  console.log("params: ", params.decksID);

  return (
    <div class={cardList}>
      <CreateNoteCard />
      <For each={props.cards}>
        {(card) => (
          <NoteCard
            note={card}
            selectedCard={card.note_id === props.selectedCard?.note_id}
            onSelectCard={props.onSelectedCard}
          />
        )}
      </For>
    </div>
  );
}

