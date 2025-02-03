import { css } from "@linaria/core";
import { DeckType } from "@/types";
import { DashboardSearch } from "@/components/DashboardSearch";
import { createSignal } from "solid-js";
import { FilterMenu } from "@/components/FilterMenu";
import { DeckContent } from "@/components/DeckContent";
import { Grid2x2, TableProperties } from "lucide-solid";
import { A } from "@solidjs/router";

const container = css`
  padding: 24px;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 50px;
`;

const header = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const pageTitle = css`
  font-size: 22px;
  font-weight: bold;
`;

const filterContainer = css`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const toggleView = css`
  border: 2px solid black;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
`;

const toggleButton = css`
  padding: 8px;
  transition: background-color 0.3s, color 0.3s;

  &.active {
    background-color: #007bff;
    color: white;
  }

  &:hover {
    background-color: #e0e0e0;
  }
`;

const button = css`
  padding: 10px 20px;
  background-color: #111827;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: #374151;
    transform: translateY(-2px);
  }

  &:active {
    background-color: #4b5563;
    transform: translateY(0);
  }

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default function Decks() {
  const [activeTab, setActiveTab] = createSignal<DeckType>("All");
  const [view, setView] = createSignal<"card" | "table">("card");

  return (
    <div class={container}>
      <div class={header}>
        <h2 class={pageTitle}>Decks</h2>
        <div class={filterContainer}>
          <A class={button} href="/app/decks/new">
            New Deck
          </A>
          <FilterMenu activeTab={activeTab} onSelect={setActiveTab} />
          <div class={toggleView}>
            <span
              class={`${toggleButton} ${view() === "card" ? "active" : ""}`}
              onClick={() => setView("card")}
            >
              <Grid2x2 />
            </span>
            <span
              class={`${toggleButton} ${view() === "table" ? "active" : ""}`}
              onClick={() => setView("table")}
            >
              <TableProperties />
            </span>
          </div>
        </div>
      </div>
      <DashboardSearch />
      <DeckContent activeTab={activeTab} view={view} />
    </div>
  );
}
