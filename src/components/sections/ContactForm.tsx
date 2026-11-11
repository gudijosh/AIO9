"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import {
  industryOptions,
  validateContact,
  type ContactField,
  type ContactFieldErrors,
} from "@/lib/contact-schema";

type Status = "idle" | "submitting" | "sent" | "not_configured" | "failed";
type Values = Record<ContactField, string>;

const empty: Values = { name: "", company: "", email: "", industry: "", message: "" };
const order: ContactField[] = ["name", "company", "email", "industry", "message"];

const control =
  "w-full rounded-xl border bg-white/[0.04] px-4 text-base text-white placeholder:text-slate transition-colors duration-200 hover:border-white/30 focus:border-signal-300 focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-signal-300/40";

function Field({
  id,
  label,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-white/80">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-[13px] text-amber">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 text-[13px] text-slate">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Inquiry form. It posts to /api/contact and reports exactly what the server
 * answered: sent, not configured (503) or failed. It never fakes a success.
 */
export function ContactForm({
  t,
  locale,
  industryNames,
  contactEmail,
}: {
  t: Dictionary["contact"]["form"];
  locale: Locale;
  industryNames: Record<string, string>;
  contactEmail?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  // "Talk about my sector" in the industry gallery preselects the industry.
  useEffect(() => {
    const onIndustry = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      setValues((current) => ({ ...current, industry: id }));
    };
    window.addEventListener("aio9:industry", onIndustry);
    return () => window.removeEventListener("aio9:industry", onIndustry);
  }, []);

  const set = (field: ContactField) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateField = (field: ContactField) => () => {
    if (!values[field]) return; // don't complain about fields not reached yet
    const result = validateContact(values);
    setErrors((current) => ({ ...current, [field]: result.ok ? undefined : result.errors[field] }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;
    const result = validateContact(values);
    if (!result.ok) {
      setErrors(result.errors);
      const first = order.find((field) => result.errors[field]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setStatus("submitting");
    const website = new FormData(event.currentTarget).get("website");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, locale, website }),
      });
      if (response.ok) {
        setStatus("sent");
        setValues(empty);
        track({ name: "contact_submit", outcome: "sent" });
      } else if (response.status === 503) {
        setStatus("not_configured");
        track({ name: "contact_submit", outcome: "not_configured" });
      } else if (response.status === 422) {
        const body = (await response.json()) as { errors?: ContactFieldErrors };
        setErrors(body.errors ?? {});
        setStatus("idle");
      } else {
        setStatus("failed");
        track({ name: "contact_submit", outcome: "error" });
      }
    } catch {
      setStatus("failed");
      track({ name: "contact_submit", outcome: "error" });
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="flex min-h-80 flex-col items-start justify-center">
        <span className="grid size-11 place-items-center rounded-xl bg-signal text-white">
          <Check aria-hidden className="size-5" strokeWidth={2.5} />
        </span>
        <p className="mt-5 text-2xl font-medium tracking-tight">{t.sent}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 py-2 text-[15px] font-medium underline decoration-white/30 underline-offset-[6px] hover:decoration-white"
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  const message = (field: ContactField) => {
    const code = errors[field];
    return code ? t.errors[code] : undefined;
  };
  const aria = (field: ContactField, hint = false) => ({
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${field}-error` : hint ? `${field}-hint` : undefined,
  });
  const border = (field: ContactField) => (errors[field] ? "border-amber" : "border-white/14");
  const hasErrors = order.some((field) => errors[field]);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field id="name" label={t.name} error={message("name")}>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={values.name}
          onChange={set("name")}
          onBlur={validateField("name")}
          className={cn(control, "h-13", border("name"))}
          {...aria("name")}
        />
      </Field>
      <Field id="company" label={t.company} error={message("company")}>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          required
          value={values.company}
          onChange={set("company")}
          onBlur={validateField("company")}
          className={cn(control, "h-13", border("company"))}
          {...aria("company")}
        />
      </Field>
      <Field id="email" label={t.email} error={message("email")}>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          required
          value={values.email}
          onChange={set("email")}
          onBlur={validateField("email")}
          className={cn(control, "h-13", border("email"))}
          {...aria("email")}
        />
      </Field>
      <Field id="industry" label={t.industry} error={message("industry")}>
        <select
          id="industry"
          name="industry"
          required
          value={values.industry}
          onChange={set("industry")}
          onBlur={validateField("industry")}
          className={cn(
            control,
            "h-13 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 fill=%22none%22 stroke=%22%238997A8%22 stroke-width=%221.5%22><path d=%22M1 1.5l5 5 5-5%22/></svg>')] bg-[position:right_1rem_center] bg-no-repeat pr-10",
            border("industry"),
            !values.industry && "text-slate",
          )}
          {...aria("industry")}
        >
          <option value="" disabled>
            {t.industryPlaceholder}
          </option>
          {industryOptions.map((option) => (
            <option key={option} value={option} className="bg-midnight text-white">
              {option === "other" ? t.other : industryNames[option]}
            </option>
          ))}
        </select>
      </Field>
      <Field
        id="message"
        label={t.message}
        error={message("message")}
        hint={t.messageHint}
        className="sm:col-span-2"
      >
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          value={values.message}
          onChange={set("message")}
          onBlur={validateField("message")}
          className={cn(control, "min-h-32 resize-y py-3.5 leading-relaxed", border("message"))}
          {...aria("message", true)}
        />
      </Field>

      {/* Honeypot: hidden from people, tempting for bots. */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2">
        <div aria-live="polite" className="text-[14px] leading-relaxed empty:hidden">
          {hasErrors && <p className="text-amber">{t.summary}</p>}
          {status === "not_configured" && (
            <p className="rounded-xl border border-amber/40 bg-amber/10 px-4 py-3 text-white">
              {t.notConfigured}
              {contactEmail && (
                <>
                  {" "}
                  {t.notConfiguredEmail}{" "}
                  <a className="underline underline-offset-4" href={`mailto:${contactEmail}`}>
                    {contactEmail}
                  </a>
                  .
                </>
              )}
            </p>
          )}
          {status === "failed" && (
            <p className="rounded-xl border border-amber/40 bg-amber/10 px-4 py-3 text-white">
              {t.failed}
            </p>
          )}
        </div>
        <button
          type="submit"
          aria-disabled={status === "submitting"}
          className="inline-flex h-13 items-center justify-center self-start rounded-full bg-signal px-8 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-[#1f4cc4] aria-disabled:opacity-60"
        >
          {status === "submitting" ? t.submitting : t.submit}
        </button>
      </div>
    </form>
  );
}
