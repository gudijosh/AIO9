import { llmsResponse } from "@/lib/llms";

/** The summary plus every question and answer, in both languages. */
export const dynamic = "force-static";

export function GET() {
  return llmsResponse(true);
}
