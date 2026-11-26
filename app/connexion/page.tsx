import AuthForm from "@/features/auth/AuthForm";
import DevLoginButton from "@/features/auth/DevLoginButton";
import { isDevLoginEnabled } from "@/features/auth/dev-login-config";
export default function ConnexionPage() {
  return (
    <div className="flex flex-col items-center gap-4">
      <AuthForm mode="signin" />
      {isDevLoginEnabled() && <DevLoginButton />}
    </div>
  );
}