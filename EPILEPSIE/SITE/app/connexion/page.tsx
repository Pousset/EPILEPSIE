// app/connexion/page.tsx
import AuthForm from "@/components/AuthForm";

export default function ConnexionPage() {
  return (
    <section className="flex justify-center px-6 py-10">
      <AuthForm mode="signin" />
    </section>
  );
}