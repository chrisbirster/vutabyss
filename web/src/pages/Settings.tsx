import { css } from "@linaria/core";
import { A, useNavigate } from "@solidjs/router";
import { useAuth } from "@/components/AuthContext";
import { createResource, Show } from "solid-js";
import { Card, CardTemplate, Deck, Note, NoteType } from "@/types";

const container = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const welcomeText = css`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

const logoutButton = css`
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c9302c;
  }
`;

const nav = css`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
`;

const navLink = css`
  text-decoration: none;
  color: white;
  background-color: #4a1e79;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #381461;
  }
`;

const grid = css`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  width: 100%;
  max-width: 800px;
`;

const card = css`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const cardTitle = css`
  font-size: 18px;
  margin-bottom: 8px;
  color: #4a1e79;
`;

const cardCount = css`
  font-size: 16px;
  color: #555;
`;


export interface DashboardData {
  card_templates: CardTemplate[];
  cards: Card[];
  decks: Deck[];
  note_types: NoteType[];
  notes: Note[];
}

async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const resp = await fetch("/api/resource", {
      method: "GET",
      credentials: "include",
    });
    if (resp.ok) {
      const data = await resp.json();
      console.log("inside fetchDashboardData: ", data);
      return data;
    } else {
      const result = await resp.text();
      console.error("inside fetchDashboardData: ", result);
      throw new Error(`Error in response: ${result}`);
    }
  } catch (err) {
    throw new Error(`Error fetching resources: ${err}`);
  }
}

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data] = createResource<DashboardData>(fetchDashboardData);


  console.log("user in dashboard: ", user());
  if (!user()) {
    navigate("/wtf");
  }

  if (data.error) {
    return <p>{JSON.stringify(data.error)}</p>
  }

  return (
    <div class={container}>
      <p class={welcomeText}>Welcome back, {user()?.email}!</p>
      <button class={logoutButton}>Logout</button>
      <nav class={nav}>
        <A class={navLink} href="/">
          Home
        </A>
        <A class={navLink} href="/decks">
          Decks
        </A>
        <A class={navLink} href="/cards">
          Cards
        </A>
        <A class={navLink} href="/templates">
          Templates
        </A>
        <A class={navLink} href="/stats">
          Stats
        </A>
        <A class={navLink} href="/sync">
          Sync
        </A>
      </nav>
      <Show when={!data.loading} fallback={<p>... loading data</p>}>
        <div class={grid}>
          <div class={card} onClick={() => navigate("/app/decks")}>
            <div class={cardTitle}>Decks</div>
            <div class={cardCount}>
              {data()?.decks ? data()?.decks.length : 0}
            </div>
          </div>
          <div class={card} onClick={() => navigate("/app/cards")}>
            <div class={cardTitle}>Cards</div>
            <div class={cardCount}>
              {data()?.cards ? data()?.cards.length : 0}
            </div>
          </div>
          <div class={card} onClick={() => navigate("/app/notes")}>
            <div class={cardTitle}>Notes</div>
            <div class={cardCount}>
              {data()?.notes ? data()?.notes.length : 0}
            </div>
          </div>
          <div class={card} onClick={() => navigate("/app/note_types")}>
            <div class={cardTitle}>Note Types</div>
            <div class={cardCount}>
              {data()?.note_types ? data()?.note_types.length : 0}
            </div>
          </div>
          <div class={card} onClick={() => navigate("/app/card_templates")}>
            <div class={cardTitle}>Card Templates</div>
            <div class={cardCount}>
              {data()?.card_templates ? data()?.card_templates.length : 0}
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
