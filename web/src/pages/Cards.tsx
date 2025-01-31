import { css } from "@linaria/core";
import { useAuth } from "@/components/AuthContext";
import { createSignal } from "solid-js";

const container = css`
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #111827;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const cardGrid = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 600px;
  width: 100%;
`;

const card = css`
  background: #1f2937;
  color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const cardContent = css`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const cardTitle = css`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const cardDescription = css`
  font-size: 14px;
  color: #d1d5db;
`;

const iconButton = css`
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 20px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    color: white;
  }
`;

export default function Flashcards() {
  const { user } = useAuth();
  console.log("user: ", user());

  const [cards] = createSignal([
    {
      title: "Zonal resources",
      description:
        "Resources operate within a single zone. If a zone becomes unavailable, all of its resources are unavailable until service is restored.",
    },
    {
      title: "Instance",
      description: "A virtual machine (VM) hosted on Google's infrastructure.",
    },
    {
      title: "What do you specify when you create an instance?",
      description: "The zone, operating system, and machine type of the instance.",
    },
    {
      title: "Compute Engine instance",
      description:
        "A Compute Engine instance has a small root persistent disk that contains the operating system.",
    },
  ]);

  return (
    <div class={container}>
      <div class={cardGrid}>
        {cards().map((card) => (
          <div class={card}>
            <div class={cardContent}>
              <div class={cardTitle}>{card.title}</div>
              <div class={cardDescription}>{card.description}</div>
            </div>
            <button class={iconButton}>⭐</button>
            <button class={iconButton}>🔊</button>
            <button class={iconButton}>✏️</button>
          </div>
        ))}
      </div>
    </div>
  );
}
