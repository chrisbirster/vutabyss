import { css } from "@linaria/core";

const socialButton = css`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &.facebook {
    color: #4267b2;
    border-color: #4267b2;
  }

  &.google {
    color: #db4437;
    border-color: #db4437;
  }
`;

export const SocialLoginButton = (props: { provider: string, name: string, socialLocation: string }) => {
  return (
    <button
      class={`${socialButton} ${props.provider}`}
      onClick={() => (window.location.href = props.socialLocation)}
    >
      {props.name}
    </button>
  );
}
