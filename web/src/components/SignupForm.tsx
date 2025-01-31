import { createUser } from "@/api";
import { css } from "@linaria/core";

const inputField = css`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const buttonPrimary = css`
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  border-radius: 8px;
  background: #4a1e79;
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;

export const SignupForm = () => {
  return (
    <form action={createUser} method="post">
      <input
        name="email"
        type="text"
        placeholder="Email"
        class={inputField}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        class={inputField}
      />
      <button class={buttonPrimary}>Create Account</button>
    </form>
  )
}
