import { css, cx } from "@linaria/core";
import { DeckType } from "@/types";
import { Accessor, createSignal, onCleanup, Setter, Show } from "solid-js";
import { ChevronLogo } from "@/components/Logos";

const tab = css`
  display: flex;
  min-width: 125px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 8px 16px;
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &.active {
    background-color: #007bff;
    color: white;
  }

  &:hover {
    background-color: #e0e0e0;
  }
`;

const dropdownMenu = css`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 150px;
  max-height: 200px;
  overflow-y: auto;
`;

const dropdownItem = css`
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover,
  &.active {
    background-color: #007bff;
    color: white;
  }
`;

const dropdownButton = css`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 0 5px;
  border: 2px solid black;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;  
`;

const active = css`
  background-color: #bada55;
`;

const rotate = css`
  svg {
    transform: rotate(180deg);
  }
`;

type FilterMenuProps = {
  activeTab: Accessor<DeckType>;
  onSelect: Setter<DeckType>;
}

export const FilterMenu = (props: FilterMenuProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const deckTab: DeckType[] = ["All", "Owned", "Shared"]

  const toggleMenu = () => {
    setIsOpen(!isOpen());
  }

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(`.${dropdownButton}`) && !target.closest(`.${dropdownMenu}`)) {
      setIsOpen(false);
    }
  };

  window.addEventListener("click", handleClickOutside);
  onCleanup(() => window.removeEventListener("click", handleClickOutside));

  return (
    <div class={dropdownButton} onClick={toggleMenu} aria-haspopup="true" aria-expanded={isOpen()}>
      <span class={tab}>
        {props.activeTab()}
      </span>
      <span>
        <span class={cx(isOpen() && rotate)}><ChevronLogo /></span>
      </span>
      <Show when={isOpen()}>
        <ul class={dropdownMenu} role="menu">
          {deckTab.map((tab) => (
            <li
              class={cx(dropdownItem, props.activeTab() === tab && active)}
              role="menuitem"
              tabindex="0"
              onClick={() => props.onSelect(tab)}>
              {tab}
            </li>
          ))}
        </ul>
      </Show>
    </div>
  );
};
