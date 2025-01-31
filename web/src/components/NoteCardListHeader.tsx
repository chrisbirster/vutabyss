import { css } from "@linaria/core";

const title = css`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #2c2c54;
`;

const example = css`
  font-size: 14px;
  color: #2c2c54;
  font-weight: normal;
`;

type NoteCardListHeaderProps = {
  name?: string;
  description?: string;
};

export const NoteCardListHeader = (props: NoteCardListHeaderProps) => {
  return (
    <>
      <h1 class={title}>{props.name}</h1>
      <p class={example}>{props.description}</p>
    </>
  )
}
