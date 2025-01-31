import { css } from "@linaria/core";
import { CardDetails } from "@/types";
import { useParams } from "@solidjs/router";
import { createResource, createSignal } from "solid-js";
import { getCardsByDeck } from "@/api";
import { NoteCardTabView } from "@/components/NoteCardTabView";
import { NoteCardListHeader } from "@/components/NoteCardListHeader";
import { NoteCardList } from "@/components/NoteCardList";

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
  display: grid;
  grid-template-columns: minmax(450px, 1fr) 2fr;
  gap: 24px;
  margin-top: 24px;
  max-width: 100%;
  padding-right: 4px;
`;

type ResourceData = {
  cards: CardDetails[];
};

export default function CardsByDeck() {
  const params = useParams()
  const [data] = createResource<ResourceData, string>(() => params.deckID, getCardsByDeck);
  const [selectedCardId, setSelectedCardId] = createSignal<number | null>(null);
  const [search, _] = createSignal("");

  const handleSelectedCardId = (note_id: number) => setSelectedCardId(note_id)
  const selectedCard = () => data()?.cards.find(card => card.note_id === selectedCardId());

  if (data.error) {
    return <p>{JSON.stringify(data.error)}</p>
  }

  return (
    <div class={container}>
      <NoteCardListHeader
        name={data()?.cards[0].deck_name}
        description={data()?.cards[0].deck_description.String}
      />
      <div class={layout}>
        <NoteCardList
          selectedCard={selectedCard()}
          onSelectedCard={handleSelectedCardId}
          cards={
            data()?.cards.filter(card =>
              card.field_content.String.toLowerCase().includes(search().toLowerCase())
            )
          }
        />
        <NoteCardTabView card={selectedCard()} />
      </div>
    </div>
  );
}

