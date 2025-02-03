import { css } from "@linaria/core";
import { CardDetails } from "@/types";
import { For } from "solid-js";
import { NoteCard } from "@/components/NoteCard";
import { CreateNoteCard } from "./CreateNoteCard";

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
  onSelectedCard: (card_id: string) => void;
};

export const NoteCardList = (props: NoteCardListProps) => {
  return (
    <div class={cardList}>
      <CreateNoteCard />
      <For each={props.cards}>
        {(card) => (
          <NoteCard
            card={card}
            selectedCard={card.card_id === props.selectedCard?.card_id}
            onSelectCard={props.onSelectedCard}
          />
        )}
      </For>
    </div>
  );
}

