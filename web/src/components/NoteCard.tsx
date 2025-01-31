import { css, cx } from "@linaria/core";
import { CardDetails } from "@/types";

const tag = css`
  background: #2c2c54;
  color: white;
  font-size: 14px;
  border-radius: 12px;
  padding: 4px 10px;
`;

const card = css`
  width: 90%;
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-top: 4px solid #2c2c54;
  border-left: 4px solid #2c2c54;
  border-right: 4px solid #2c2c54;
  border-bottom: 8px solid #2c2c54;
  cursor: pointer;
  transition: all 0.2s;
  transform-origin: center left; 

  &:hover {
    transform: translateX(4px);
  }
`;

const selected = css`
  background: #f0f0f0;
  border-left: 8px solid #2c2c54;
`;

const content = css`
  word-wrap: break-word;
`;

type NoteCardProps = {
  note: CardDetails,
  selectedCard: boolean,
  onSelectCard: (note_id: number) => void,
}
export const NoteCard = (props: NoteCardProps) => {
  return (
    <div
      class={cx(card, props.selectedCard && selected)}
      onClick={() => props.onSelectCard(props.note.note_id)}
    >
      <strong>{props.note.field_name.String}</strong>
      <p class={content}>{props.note.field_content.String}</p>
      <span class={tag}>{props.note.note_type_name}</span>
    </div>

  );
}

