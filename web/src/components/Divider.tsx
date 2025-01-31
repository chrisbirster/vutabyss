import { css } from "@linaria/core";

const divider = css`
  text-align: center;
  margin: 16px 0;
  font-size: 14px;
  color: #888;
`;

export const Divider = () => (
  <div class={divider}>OR</div>
)
