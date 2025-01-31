import { Deck } from "@/types";
import { css } from "@linaria/core";
import { A } from "@solidjs/router";

const container = css`
  display: flex;
  padding: 20px;
  justify-content: center;
  overflow-x: auto;
`;

const deckList = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-column-gap: 10px;
  position: relative;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
    & > a:nth-child(n+6) {
      margin-left: -40px; 
      z-index: 10;
    }
  }
`;

const deckItem = css`
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
    height: 150px; /* Fixed height to handle overflow */

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    }
  `;

const deckHeader = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9em;
    color: #555;
    margin-bottom: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  `;

const termCount = css`
    font-weight: bold;
  `;

const teacherBadge = css`
    background-color: #ffd700;
    color: #fff;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.8em;
    flex-shrink: 0;
  `;

const deckTitle = css`
    font-size: 1.2em;
    font-weight: bold;
    color: #333;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  `;

export const DecksSectionCardView = (props: { decks?: Deck[] }) => {
  return (
    <div class={container}>
      <div class={deckList}>
        {props.decks?.map((deck) => (
          <A href={`/app/decks/${deck.id}`}
            class={deckItem}
          >
            <div class={deckHeader}>
              <span class={termCount}>{deck.card_count} Terms</span> | <span>{deck.owner_id}</span>
              <span class={teacherBadge}>Teacher</span>
            </div>
            <div class={deckTitle}>{deck.name}</div>
          </A>
        ))}
      </div>
    </div >
  );
}
