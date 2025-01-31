import { For, Show } from "solid-js";
import { css } from "@linaria/core";
import { Card, Deck } from "@/types";

import { A } from "@solidjs/router";
import { createResource } from "solid-js";
import { getDashboard } from "@/api";
import { DeckImage } from "./DeckImage";
import { DeckInfo } from "./DeckInfo";

const deckList = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const deckItem = css`
  display: flex;
  align-items: center;
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  gap: 16px;
`;

const trashIcon = css`
  margin-left: auto;
  font-size: 20px;
  cursor: pointer;
`;

type ResourceData = { owned: Deck[], shared: Deck[] }

export const DashboardDecks = () => {
  const [data] = createResource<ResourceData>(getDashboard);

  if (data.error) {
    return <p>{JSON.stringify(data.error)}</p>
  }

  return (
    <div class={deckList}>
      <Show when={!data.loading} fallback={<p>... loading decks</p>}>
        <For each={data()?.owned}>
          {(deck) => (
            <div class={deckItem}>
              <A href={"/app/cards/"}>
                <DeckImage name={deck.name} />
                <DeckInfo
                  name={deck.name}
                  numberOfCards={15}
                  lastStudied={deck.updated_at}
                />
                <span class={trashIcon}>🗑️</span>
              </A>
            </div>
          )}
        </For>
      </Show>
      {JSON.stringify(data())}
    </div >
  );
}

