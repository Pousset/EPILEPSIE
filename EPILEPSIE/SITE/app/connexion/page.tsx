// app/connexion/page.tsx
import AuthForm from "@/features/auth/AuthForm";

export default function ConnexionPage() {
  return (
    <section className="flex justify-center px-6 py-10">
      <AuthForm mode="signin" />
    </section>
  );
}
