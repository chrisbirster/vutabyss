import { AuthContainer } from "@/components/AuthContainer";
import { Divider } from "@/components/Divider";
import { LoginForm } from "@/components/LoginForm";
import SocialLoginProviders from "@/components/SocialLoginProviders";
import { css } from "@linaria/core";
import { A } from "@solidjs/router";

const signupText = css`
  margin-top: 12px;
  font-size: 14px;
  color: #555;
  text-align: center;

  & a {
    color: #4a1e79;
    text-decoration: none;
    font-weight: bold;
  }
`;

export default function LoginWithSocials() {
  return (
    <AuthContainer title="Login">
      <SocialLoginProviders />
      <Divider />
      <LoginForm />
      <p class={signupText}>
        Don’t Have An Account? <A href="/signup">Sign Up</A>
      </p>
    </AuthContainer>
  );
}
