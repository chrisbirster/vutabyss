import { css } from "@linaria/core";

const contentPanel = css`
  padding: 16px;
  background: #f8f8f8;
  border-radius: 8px;
  min-height: 200px;
`;

type NoteCardTabViewContentProps = {
  content?: string
};

export const NoteCardTabViewContent = (props: NoteCardTabViewContentProps) => {
  return (
    <div class={contentPanel}>{props.content}</div>
  );
}

