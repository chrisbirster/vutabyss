import { css } from "@linaria/core";
import { A } from "@solidjs/router";
import SocialLoginProviders from "@/components/SocialLoginProviders";
import { Divider } from "@/components/Divider";
import { SignupForm } from "@/components/SignupForm";
import { AuthContainer } from "@/components/AuthContainer";

const loginText = css`
  margin-top: 12px;
  font-size: 14px;
  color: #555;
  text-align: center;
`;

export default function SignUp() {
  return (
    <AuthContainer title={"Sign Up"}>
      <SocialLoginProviders />
      <Divider />
      <SignupForm />
      <p class={loginText}>
        Already Have An Account? <A href="/login">Login</A>
      </p>
    </AuthContainer>
  );
}
