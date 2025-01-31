import { css } from "@linaria/core";
import { SearchLogo } from "./Logos";
import { createSignal, onCleanup, Show } from "solid-js";

const searchBar = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  flex: 1;
`;

const searchContent = css`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  gap: 8px;
`;

const logo = css`
  padding: 0 10px; 
  display: flex;
  align-items: center;
  justify-items; center;
  flex-shrink: 0;
`;

const searchInput = css`
  border: none; 
  outline: none; 
  flex: 1;
  min-width: 0;
`;

const clearButton = css`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 0 10px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

export const DashboardSearch = () => {
  const [searchTerm, setSearchTerm] = createSignal<string>();
  let debounceTimeout: NodeJS.Timeout;
  let inputRef!: HTMLInputElement;

  const handleInput = (e: InputEvent) => {
    const input = e.currentTarget as HTMLInputElement;
    const value = input.value;
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      console.log("searching for: ", value);
      setSearchTerm(value);
    }, 1000);
  }

  const clearSearch = () => {
    setSearchTerm("");
    inputRef.value = "";
  };

  onCleanup(() => {
    clearTimeout(debounceTimeout);
  })

  return (
    <div class={searchBar}>
      <div class={searchContent}>
        <span class={logo}><SearchLogo /></span>
        <input
          ref={inputRef}
          class={searchInput}
          type="text"
          placeholder="Search ..."
          onInput={handleInput}
          aria-label="Search Decks"
        />
      </div>
      <Show when={searchTerm()}>
        <button
          class={clearButton}
          onClick={clearSearch}
          aria-label="Clear Search"
        >
          &times;
        </button>
      </Show>
    </div>
  );
}

