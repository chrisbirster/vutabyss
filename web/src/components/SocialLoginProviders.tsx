import { SocialLoginButton } from "./SocialLoginButton";

export default function LoginWithSocials() {
  return (
    <>
      <SocialLoginButton provider="facebook" name="Login with Facebook" socialLocation="/auth/facebook" />
      <SocialLoginButton provider="google" name="Login with Google" socialLocation="/auth/google" />
    </>
  );
}
