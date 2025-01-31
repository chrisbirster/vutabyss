import { css } from "@linaria/core";

const deckImage = css`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  border-radius: 50%;
  background-color: #ffa500; /* Default orange color */
  background-size: cover;
  background-position: center;
`;

export const DeckImage = (props: { name: string }) => {
  return (
    <div class={deckImage}>
      {props.name.charAt(0).toUpperCase()}
    </div>
  )
}
