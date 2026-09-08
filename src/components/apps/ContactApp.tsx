import { type FormEvent, type ReactNode, useState } from "react";
import { contactEmail, githubProfile } from "@/data/socials";
import { openMailtoDraft, sendContactMessage } from "@/lib/contact";

type Status = { kind: "ok" | "err" | "info"; text: string } | null;

export default function ContactApp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const [sending, setSending] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    };
    if (!payload.name || !payload.email || !payload.message) {
      setStatus({ kind: "err", text: "Fill in name, email, and a message." });
      return;
    }

    setSending(true);
    setStatus({ kind: "info", text: "Sending…" });
    try {
      const text = await sendContactMessage(payload);
      setStatus({ kind: "ok", text });
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      openMailtoDraft(payload);
      setStatus({
        kind: "info",
        text: `Couldn’t send from the browser, so your mail app should open addressed to ${contactEmail}.`,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="space-y-4 p-5 text-sm" onSubmit={(event) => void onSubmit(event)}>
      <div>
        <p className="text-xs text-os-accent">Contact</p>
        <h3 className="mt-1 font-display text-2xl font-medium">Send a message</h3>
        <p className="mt-1 text-xs text-os-muted">
          Goes to{" "}
          <a className="text-os-accent hover:underline" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
          .
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
      <Field label="Your email" htmlFor="tx-email">
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
        disabled={sending}
        className="w-full rounded-xl bg-os-accent px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {sending ? "Sending…" : "Send"}
      </button>

      {status && (
        <p
          role="status"
          className={
            status.kind === "ok"
              ? "rounded-xl border border-os-ok/30 bg-os-ok/10 p-3 text-xs text-os-ok"
              : status.kind === "err"
                ? "rounded-xl border border-os-fail/30 bg-os-fail/10 p-3 text-xs text-os-fail"
                : "rounded-xl border border-os-line bg-os-raised/40 p-3 text-xs text-os-muted"
          }
        >
          {status.text}
        </p>
      )}

      <a href={githubProfile.url} target="_blank" rel="noreferrer" className="inline-block text-xs text-os-accent hover:underline">
        GitHub ↗
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
      <span className="text-[11px] text-os-muted">{label}</span>
      <span className="mt-1 block">{children}</span>
    </label>
  );
}
