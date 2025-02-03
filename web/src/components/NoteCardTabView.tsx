import { css } from "@linaria/core";
import { CardDetails } from "@/types";
import { createSignal, For, Match, Show, Switch } from "solid-js";
import { NoteCardTabViewContent } from "./NoteCardTabViewContent";
import { NoteCardTabViewButton } from "./NoteCardTabViewButton";

const detailView = css`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const tabs = css`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const row = css`
  display: flex;
  gap: 16px;
  margin-bottom: 10px;
`;

type NoteCardTabViewProps = {
  card?: CardDetails;
};

export const NoteCardTabView = (props: NoteCardTabViewProps) => {
  const [activeTab, setActiveTab] = createSignal<"front" | "back">("front");
  const isFront = () => activeTab() === "front";

  return (
    <Show when={props.card}>
      <div class={detailView}>
        <div class={tabs}>
          <NoteCardTabViewButton
            name={"Front"}
            isActive={isFront()}
            onActive={() => setActiveTab("front")}
          />
          <NoteCardTabViewButton
            name={"Back"}
            isActive={!isFront()}
            onActive={() => setActiveTab("back")}
          />
        </div>
        <Switch fallback={<div>Please select a card</div>}>
          <Match when={isFront()}>
            <For each={Object.entries(props.card)}>
              {([key, value]) => {
                return (
                  <div class={row}>
                    <p>{key}</p>
                    <p>{value}</p>
                  </div>
                );
              }}
            </For>
            <NoteCardTabViewContent content={props.card?.front_html} />
          </Match>
          <Match when={!isFront()}>
            <NoteCardTabViewContent content={props.card?.back_html} />
          </Match>
        </Switch>
      </div>
    </Show>
  );
}

