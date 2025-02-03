import { css } from "@linaria/core";
import { CombinedCard } from "@/types";
import { useParams } from "@solidjs/router";
import { createResource, createMemo, createSignal } from "solid-js";
import { getCardsByDeck } from "@/api";
import { NoteCardListHeader } from "@/components/NoteCardListHeader";
import "quill/dist/quill.snow.css";
import { CombinedNoteCardList } from "@/components/CombinedNoteCardList";

const container = css`
  padding: 24px;
  background-color: #e5b8b2;
  font-family: Arial, sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
  width: 100%;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }
`;

const layout = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;
  max-width: 100%;
  padding-right: 4px;
`;

type ResourceData = {
  cards: CombinedCard[];
};

export default function NewCard() {
  const params = useParams();
  const [data] = createResource<ResourceData, string>(() => params.deckID, getCardsByDeck);

  const [search, setSearch] = createSignal("");

  return (
    <div class={container}>
      <NoteCardListHeader
        name={data()?.cards[0]?.deck_name}
        description={data()?.cards[0]?.deck_description}
      />
      <div class={layout}>
      </div>
    </div>
  );
}
