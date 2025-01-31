import { css, cx } from "@linaria/core";
import { A, useParams } from "@solidjs/router";
import { Component } from "solid-js";

const createCard = css`
  width: 90%;
  background: #f9f9f9;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-top: 4px solid #2c2c54;
  border-left: 4px solid #2c2c54;
  border-right: 4px solid #2c2c54;
  border-bottom: 8px solid #2c2c54;
  cursor: pointer;
  transition: all 0.2s;
  position: sticky;
  top: 0;
  z-index: 10; /* Ensure it stays above other cards */

  &:hover {
    transform: translateX(4px);
    background: #bada55;
  }
`;

const createIcon = css`
  font-size: 24px;
  margin-right: 8px;
`;

type CreateNoteCardProps = {
  onCreate?: () => void;
};

export const CreateNoteCard: Component<CreateNoteCardProps> = (props) => {
  const params = useParams()
  const deckID = params.deckID
  console.log("inside CreateNoteCard: ", deckID);
  return (
    <A href={`/app/decks/${deckID}/cards/new`}>
      <div class={cx(createCard)} onClick={props.onCreate}>
        <strong>
          <span class={createIcon}>+</span><p>Create New Note</p>
        </strong>
      </div>
    </A>
  );
};
