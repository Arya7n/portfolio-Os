import { type FormEvent, type ReactNode, useState } from "react";
import { githubProfile } from "@/data/socials";

export default function ContactApp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("Fill every field before transmitting.");
      return;
    }

    const body = [
      `Name: ${name.trim()}`,
      `From: ${email.trim()}`,
      "",
      message.trim(),
    ].join("\n");

    const mailto = `mailto:?subject=${encodeURIComponent(`Transmission from ${name.trim()} · ARYAN OS`)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setStatus(
      "TRANSMISSION PREPARED ✓  Your mail client should open with the message. Nothing was uploaded to a server — Aryan’s public inbox is not published, so add a recipient or continue via GitHub.",
    );
  };

  return (
    <form className="space-y-4 p-5 text-sm" onSubmit={onSubmit}>
      <div>
        <p className="text-xs text-os-accent">Contact</p>
        <h3 className="mt-1 font-display text-2xl font-medium">Send a message</h3>
        <p className="mt-1 text-xs text-os-muted">
          No mail backend is attached. This prepares a local message instead of pretending it was delivered.
        </p>
      </div>

      <Field label="Name" htmlFor="tx-name">
        <input
          id="tx-name"
          name="name"
          value={name}
          autoComplete="name"
          required
          onChange={(event) => setName(event.target.value)}
          className="field-input"
        />
      </Field>
      <Field label="Email" htmlFor="tx-email">
        <input
          id="tx-email"
          name="email"
          type="email"
          value={email}
          autoComplete="email"
          required
          onChange={(event) => setEmail(event.target.value)}
          className="field-input"
        />
      </Field>
      <Field label="Message" htmlFor="tx-message">
        <textarea
          id="tx-message"
          name="message"
          rows={5}
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="field-input resize-y"
        />
      </Field>

      <button
        type="submit"
        className="w-full border border-os-accent/40 bg-os-accent/12 px-4 py-2.5 text-sm"
      >
        SEND TRANSMISSION
      </button>

      {status && (
        <p role="status" className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-relaxed text-os-muted">
          {status}
        </p>
      )}

      <a href={githubProfile.url} target="_blank" rel="noreferrer" className="inline-block text-xs text-os-accent hover:underline">
        Public channel: GitHub ↗
      </a>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="font-mono text-[10px] tracking-[0.18em] text-os-muted">{label.toUpperCase()}</span>
      <span className="mt-1 block">{children}</span>
    </label>
  );
}
