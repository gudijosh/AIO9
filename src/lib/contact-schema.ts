import { z } from "zod";
import { industryIds } from "@/data/industries";

export const industryOptions = [...industryIds, "other"] as const;
export type IndustryOption = (typeof industryOptions)[number];

/** Validation messages are codes; the UI maps them to the active language. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "name_min").max(80, "too_long"),
  company: z.string().trim().min(2, "company_min").max(120, "too_long"),
  email: z.string().trim().max(160, "too_long").email("email_invalid"),
  industry: z.enum(industryOptions, "industry_required"),
  message: z.string().trim().min(20, "message_min").max(2000, "too_long"),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;
export type ContactErrorCode =
  | "name_min"
  | "company_min"
  | "email_invalid"
  | "industry_required"
  | "message_min"
  | "too_long";

export type ContactFieldErrors = Partial<Record<ContactField, ContactErrorCode>>;

export function validateContact(
  data: unknown,
): { ok: true; data: ContactInput } | { ok: false; errors: ContactFieldErrors } {
  const result = contactSchema.safeParse(data);
  if (result.success) return { ok: true, data: result.data };
  const errors: ContactFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactField | undefined;
    if (field && !errors[field]) errors[field] = issue.message as ContactErrorCode;
  }
  return { ok: false, errors };
}
