import { llmsResponse } from "@/lib/llms";

/** Summary of the site for AI agents. See src/lib/llms.ts. */
export const dynamic = "force-static";

export function GET() {
  return llmsResponse(false);
}
