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

const selectedStyle = css`
  background: #f0f0f0;
  border-left: 8px solid #2c2c54;
`;

const content = css`
  word-wrap: break-word;
  margin-top: 8px;
`;

const header = css`
  display: flex;
  justify-content: flex-end;
`;

type NoteCardProps = {
  card: CardDetails,
  selectedCard: boolean,
  onSelectCard: (card_id: string) => void,
}
export const NoteCard = (props: NoteCardProps) => {
  return (
    <div
      class={cx(card, props.selectedCard && selectedStyle)}
      onClick={() => props.onSelectCard(props.card.card_id)}
    >
      {/* Header: shows card type on the top right */}
      <div class={header}>
        <span class={tag}>{props.card.template_name}</span>
      </div>
      {/* Content: show front content then back content */}
      <div class={content}>
        <p>{props.card.front_content}</p>
        <p>{props.card.back_content}</p>
      </div>
    </div>
  );
};
