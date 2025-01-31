import { Deck, DeckType } from "@/types";
import { Accessor, createResource, Match, Show, Switch } from "solid-js";
import { getDecks } from "@/api";
import { DecksSectionCardView } from "@/components/DecksSectionCardView";
import { DecksSectionTableView } from "@/components/DecksSectionTableView";
import { useAuth } from "./AuthContext";
import { css } from "@linaria/core";

const separator = css`
  margin: 50px 0;
`;

type ResourceData = { decks: Deck[] };

export const DeckContent = (props: { activeTab: Accessor<DeckType>, view: Accessor<"card" | "table"> }) => {
  const { user } = useAuth();
  const [data] = createResource<ResourceData>(getDecks);

  // Function to filter decks based on activeTab
  const filteredDecks = () => {
    if (!data() || !data()?.decks) return [];
    switch (props.activeTab()) {
      case "Shared":
        return data()?.decks.filter(deck => deck.owner_id === user()?.user_id);
      case "Owned":
        return data()?.decks.filter(deck => deck.owner_id !== user()?.user_id);
      case "All":
      default:
        return data()?.decks;
    }
  };

  return (
    <Show when={!data.loading} fallback={<p>Loading dashboard data...</p>}>
      <hr class={separator} />
      <Switch fallback={<p>No decks found...</p>}>
        <Match when={data.error}>
          <p>Error loading decks: {data.error}</p>
        </Match>
        <Match when={props.view() === "card"}>
          <DecksSectionCardView decks={filteredDecks()} />
        </Match>
        <Match when={props.view() === "table"}>
          <DecksSectionTableView decks={filteredDecks()} />
        </Match>
      </Switch>
    </Show>
  );
};
