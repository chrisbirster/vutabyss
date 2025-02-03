import { css } from "@linaria/core";
import { CardDetails, Deck } from "@/types";
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
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
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
  deck: Deck;
  cards: CardDetails[];
};

export default function CardsByDeck() {
  const params = useParams()
  const [data] = createResource<ResourceData, string>(() => params.deckID, getCardsByDeck);
  const [selectedCardId, setSelectedCardId] = createSignal<number | null>(null);
  const [search, _] = createSignal("");

  // Use card_id (or note_id if you prefer) as the key for selection.
  const handleSelectedCardId = (cardId: string) => setSelectedCardId(cardId);
  const selectedCard = () => data()?.cards.find(card => card.card_id === selectedCardId());


  if (data.error) {
    return <p>{JSON.stringify(data.error)}</p>
  }


  return (
    <div class={container}>
      <NoteCardListHeader
        name={data()?.deck.deck_name}
        description={data()?.deck.deck_description}
      />
      <div class={layout}>
        {/* Left column: List of cards */}
        <NoteCardList
          cards={data()?.cards || []}
          onSelectedCard={handleSelectedCardId}
          selectedCard={selectedCard()}
        />
        {/* Right column: Detailed view */}
        <NoteCardTabView card={selectedCard()} />
      </div>
    </div>
  );
}

