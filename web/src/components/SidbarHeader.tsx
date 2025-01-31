import { css } from "@linaria/core";
import { Menu } from "./Menu";
import { Accessor, Show } from "solid-js";

const logoContainer = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24px;
  font-weight: bold;
  padding-bottom: 20px;
  border-bottom: 1px solid #222;
`;

type SidebarProps = {
  toggle: () => void,
  collapsed: Accessor<boolean>
}

export const SidebarHeader = (props: SidebarProps) => {
  return (
    <div class={logoContainer}>
      <span onClick={props.toggle}><Menu /></span>
      <Show when={!props.collapsed()}>
        <span>Voidabyss</span>
      </Show>
    </div>
  );
};
