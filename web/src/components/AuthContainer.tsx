import { css } from "@linaria/core";
import { ParentProps } from "solid-js";

const container = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fa;
  font-family: Arial, sans-serif;
`;

const content = css`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
`;

const title = css`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
`;

export type AuthContentProps = ParentProps & {
  title: string;
}

export const AuthContainer = (props: AuthContentProps) => {
  return (
    <div class={container}>
      <div class={content}>
        <h1 class={title}>{props.title}</h1>
        {props.children}
      </div>
    </div>
  );
}
