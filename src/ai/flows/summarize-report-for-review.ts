
'use server';

/**
 * @fileOverview Summarizes a labor report for moderator review, highlighting key details.
 *
 * - summarizeReport - A function that summarizes the report.
 * - SummarizeReportInput - The input type for the summarizeReport function.
 * - SummarizeReportOutput - The return type for the summarizeReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeReportInputSchema = z.object({
  date: z.string().describe('The date of the reported incidence.'),
  location: z.string().describe('The specific address or area where the incident occurred.'),
  city: z.string().describe('The city where the incident occurred.'),
  type: z.string().describe('The type of labor issue reported (e.g., wage theft, safety violation).'),
  description: z.string().describe('A detailed description of the incident.'),
  proof: z.string().optional().describe('A data URI of photo or video evidence, must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
});
export type SummarizeReportInput = z.infer<typeof SummarizeReportInputSchema>;

const SummarizeReportOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the report, including key details.'),
});
export type SummarizeReportOutput = z.infer<typeof SummarizeReportOutputSchema>;

export async function summarizeReport(input: SummarizeReportInput): Promise<SummarizeReportOutput> {
  return summarizeReportFlow(input);
}

const summarizeReportPrompt = ai.definePrompt({
  name: 'summarizeReportPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: SummarizeReportInputSchema},
  output: {schema: SummarizeReportOutputSchema},
  prompt: `You are an AI assistant helping moderators quickly assess labor exploitation reports. Summarize the key details of the report.

Report Details:
Date: {{{date}}}
Location: {{{location}}}
City: {{{city}}}
Type of Issue: {{{type}}}
Description: {{{description}}}
Evidence: {{#if proof}}{{media url=proof}}{{else}}No evidence provided{{/if}}

Respond in the following format:
Summary: ...`,
});

const summarizeReportFlow = ai.defineFlow(
  {
    name: 'summarizeReportFlow',
    inputSchema: SummarizeReportInputSchema,
    outputSchema: SummarizeReportOutputSchema,
  },
  async input => {
    const {output} = await summarizeReportPrompt(input);
    return output!;
  }
);

