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

  // Group cards by card_id
  const groupedCards = createMemo(() => {
    const cards = data()?.cards || [];
    const cardMap = new Map<string, CombinedCard>();

    cards.forEach(card => {
      const card_id = card.card_id;
      if (!cardMap.has(card_id)) {
        cardMap.set(card_id, {
          card_id,
          note_id: card.note_id,
          note_type_id: card.note_type_id,
          note_type_name: card.note_type_name,
          deck_id: card.deck_id,
          deck_name: card.deck_name,
          deck_description: card.deck_description.String,
          due_date: card.due_date.Valid ? card.due_date.Time : undefined,
          template_name: card.template_name,
          front_html: card.front_html,
          back_html: card.back_html,
          front_content: "",
          back_content: "",
        });
      }
      const combined = cardMap.get(card_id)!;
      const fieldName = card.field_name.String.toLowerCase();
      if (fieldName === "front") {
        combined.front_content = card.field_content.String;
      } else if (fieldName === "back") {
        combined.back_content = card.field_content.String;
      }
      cardMap.set(card_id, combined);
    });

    return Array.from(cardMap.values());
  });

  if (data.error) {
    return <p>{JSON.stringify(data.error)}</p>;
  }

  return (
    <div class={container}>
      <NoteCardListHeader
        name={data()?.cards[0]?.deck_name}
        description={data()?.cards[0]?.deck_description}
      />
      <div class={layout}>
        <CombinedNoteCardList
          cards={groupedCards().filter(card =>
            card.front_content.toLowerCase().includes(search().toLowerCase()) ||
            card.back_content.toLowerCase().includes(search().toLowerCase())
          )}
        />
      </div>
    </div>
  );
}
