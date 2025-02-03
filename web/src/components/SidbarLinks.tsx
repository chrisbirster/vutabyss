import { css, cx } from "@linaria/core";
import { A } from "@solidjs/router";
import { Accessor, For, JSX, Show } from "solid-js";
import {
  LayoutDashboard,
  BookText,
  SquareLibrary,
  BookDashed,
} from "lucide-solid";

const navItem = css`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  font-size: 16px;
  color: #b0a8f8;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s ease, opacity 0.3s ease;

  &:hover {
    background-color: #1a1a3d;
  }
`;

const activeNavItem = css`
  background-color: #302e5a;
`;

const collapsedNavItem = css`
  justify-content:center;
`;


const sectionHeader = css`
  font-size: 14px;
  color: #777;
  margin-top: 15px;
  padding-left: 10px;
`;

const linkLabel = css`
  transition: opacity 0.3s ease;
`;

const logoContainer = css`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24ppx;
  height: 24ppx;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;


type SidebarItem = {
  logo: JSX.Element;
  label: string;
  to: string;
}

export const SidebarLinks = (props: { isCollapsed: Accessor<boolean> }) => {
  const sidebarItems: SidebarItem[] = [
    {
      logo: <LayoutDashboard />,
      label: "Home",
      to: "/app/library",
    },
    {
      logo: <BookText />,
      label: "Cards",
      to: "/app/cards",
    },
    {
      logo: <SquareLibrary />,
      label: "Decks",
      to: "/app/decks",
    },
    {
      logo: <BookDashed />,
      label: "Templates",
      to: "/app/templates",
    },
  ]

  return (
    <>
      <For each={sidebarItems}>
        {(item) => (
          <A class={cx(navItem, props.isCollapsed() && collapsedNavItem)} activeClass={activeNavItem} href={item.to}>
            <span class={logoContainer}>{item.logo}</span>
            <Show when={!props.isCollapsed()}>
              <span class={linkLabel}>{item.label}</span>
            </Show>
          </A>
        )}
      </For >
      <div class={sectionHeader}>Your Favorites</div>
      <A class={navItem} activeClass={activeNavItem} href="/decks">
        <span class={logoContainer}><SquareLibrary /></span>
        <Show when={!props.isCollapsed()}>
          <span>Decks</span>
        </Show>
      </A>
    </>
  );
};
