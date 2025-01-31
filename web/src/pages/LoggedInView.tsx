import { css } from "@linaria/core";
import { A, useNavigate } from "@solidjs/router";
import { useAuth } from "@/components/AuthContext";

const container = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const welcomeText = css`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

const logoutButton = css`
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c9302c;
  }
`;

const nav = css`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
`;

const navLink = css`
  text-decoration: none;
  color: white;
  background-color: #4a1e79;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #381461;
  }
`;

export const LoggedInView = (props: any) => {
  const { user } = useAuth();
  console.log("user: ", user());
  const navigate = useNavigate();

  if (!user()) {
    console.log("we made it here in the navigate route");
    navigate("/login");
  }

  return (
    <div class={container}>
      <p class={welcomeText}>Welcome back, {user()?.email}!</p>
      <button class={logoutButton}>Logout</button>
      <nav class={nav}>
        <A class={navLink} href="/">
          Home
        </A>
        <A class={navLink} href="/decks">
          Decks
        </A>
        <A class={navLink} href="/cards">
          Cards
        </A>
        <A class={navLink} href="/templates">
          Templates
        </A>
        <A class={navLink} href="/stats">
          Stats
        </A>
        <A class={navLink} href="/sync">
          Sync
        </A>
      </nav>
      {props.children}
    </div>
  );
};
