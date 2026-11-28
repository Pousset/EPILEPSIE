import { Resend } from "resend";

type EmailInput = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail({ to, subject, text }: EmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error("La configuration email est incomplète.");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    text,
  });

  if (error) {
    throw new Error("Échec de l'envoi de l'email");
  }
}

// Défense en profondeur : même si une erreur tierce (réseau, SDK) embarque une adresse
// ou un lien (ex. lien de vérification avec token), ils n'atteignent jamais les logs.
function redact(message: string): string {
  return message
    .replace(/https?:\/\/\S+/g, "[lien masqué]")
    .replace(/[^\s<>"']+@[^\s<>"']+/g, "[adresse masquée]");
}

// Envoi sans attendre le résultat : le temps de réponse ne révèle pas si le compte existe,
// donc pas d'énumération de comptes. Un échec est journalisé, jamais remonté.
// `label` doit être un texte fixe décrit dans le code, jamais une donnée utilisateur.
export function sendEmailInBackground(mail: EmailInput, label: string): void {
  void sendEmail(mail).catch((error: unknown) => {
    const reason = error instanceof Error ? redact(error.message) : "erreur inconnue";
    // Uniquement une chaîne : ne jamais passer l'objet erreur (sa stack peut contenir des données).
    console.error(`[email] Échec de l'envoi (${label}) : ${reason}`);
  });
}