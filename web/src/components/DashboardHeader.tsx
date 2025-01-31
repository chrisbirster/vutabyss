import { css } from "@linaria/core";
import { A } from "@solidjs/router";

const header = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const logo = css`
  font-size: 24px;
  font-weight: bold;
`;

const settingsIcon = css`
  font-size: 24px;
  cursor: pointer;
`;

const sectionTitle = css`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const content = css`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
`;

const card = css`
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const NewCard = () => (
  <div class={card}>
    <A href="/api/cards/">
      <p>New Card</p>
      <span>➕</span>
    </A>
  </div>
)

const NewDeck = () => (
  <div class={card}>
    <A href="/api/decks/">
      <p>New Deck</p>
      <span>📄</span>
    </A>
  </div>
)

export const DashboardHeader = () => {
  return (
    <>
      <div class={header}>
        <span class={logo}>⚡</span>
        <span class={settingsIcon}>⚙️</span>
      </div>
      <h2 class={sectionTitle}>Dashboard</h2>
      <div class={content}>
        <NewCard />
        <NewDeck />
      </div>
    </>
  )
}
