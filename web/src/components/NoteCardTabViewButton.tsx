import { css, cx } from "@linaria/core";

const tab = css`
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  background: #f0f0f0;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const tabActive = css`
  background: #2c2c54;
  color: white;
`;

type NoteCardTabViewButtonProps = {
  name: string;
  isActive: boolean;
  onActive: () => void;
};

export const NoteCardTabViewButton = (props: NoteCardTabViewButtonProps) => {
  return (
    <button
      class={cx(tab, props.isActive && tabActive)}
      onClick={props.onActive}
    >
      {props.name}
    </button>
  );
}

