// app/inscription/page.tsx
import AuthForm from "@/features/auth/AuthForm";

export default function InscriptionPage() {
  return (
    <section className="flex justify-center px-6 py-10">
      <AuthForm mode="signup" />
    </section>
  );
}
