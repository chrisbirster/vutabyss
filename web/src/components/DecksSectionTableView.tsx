import { Deck } from "@/types";
import { css } from "@linaria/core";
import { A } from "@solidjs/router";

const container = css`
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #111827;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const deckList = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 800px;
`;

const deckItem = css`
  background: #1f2937;
  color: white;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  transition: background 0.3s ease;
  cursor: pointer;

  &:hover {
    background: #374151;
  }
`;

const deckHeader = css`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #9ca3af;
`;

const termCount = css`
  font-weight: bold;
`;

const teacherBadge = css`
  background: #4b5563;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: bold;
`;

const deckTitle = css`
  font-size: 18px;
  font-weight: bold;
  margin-top: 5px;
`;

export const DecksSectionTableView = (props: { decks?: Deck[] }) => {
  return (
    <div class={container}>
      <div class={deckList}>
        {props.decks?.map((deck) => (
          <A href={`/app/decks/${deck.id}`}>
            <div class={deckItem}>
              <div class={deckHeader}>
                <span class={termCount}>{deck.card_count} Terms</span> | <span>{deck.owner_id}</span>
                <span class={teacherBadge}>Teacher</span>
              </div>
              <div class={deckTitle}>{deck.name}</div>
            </div>
          </A>
        ))}
      </div>
    </div >
  );
}
