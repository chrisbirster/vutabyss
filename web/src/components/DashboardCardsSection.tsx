import { For, Show } from "solid-js";
import { css } from "@linaria/core";
import { Card } from "@/types";
import { A } from "@solidjs/router";

const sectionContainer = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const cardItem = css`
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const CardsSection = (props: { visible: boolean, cards: Card[] }) => {

  return (
    <Show when={props.visible}>
      <div class={sectionContainer}>
        <For each={props.cards}>
          {(card: Card) => (
            <A href={`/app/cards/${card.cid}`}>
              <div class={cardItem}>
                <h4>Card ID: {card.id}</h4>
                <p>
                  <strong>Note ID:</strong> {card.note_id}
                </p>
                <p>
                  <strong>Status:</strong> {card.status || "N/A"}
                </p>
                <p>
                  <strong>Due Date:</strong> {card.due_date || "N/A"}
                </p>
                <p>
                  <strong>Created At:</strong> {card.created_at}
                </p>
              </div>
            </A>
          )}
        </For>
      </div>
    </Show>
  );
};
