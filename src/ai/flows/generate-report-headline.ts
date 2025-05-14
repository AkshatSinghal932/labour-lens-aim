
'use server';
/**
 * @fileOverview AI flow to generate a concise headline for a labor report.
 *
 * - generateReportHeadline - A function that generates a headline for the report.
 * - GenerateReportHeadlineInput - The input type for the generateReportHeadline function.
 * - GenerateReportHeadlineOutput - The output type for the generateReportHeadline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportHeadlineInputSchema = z.object({
  description: z.string().describe('The detailed description of the incident.'),
  typeOfIncidence: z.string().describe('The type of labor issue reported (e.g., wage theft, safety violation).'),
  location: z.string().describe('The specific address or area where the incident occurred (for context only, do not include in headline).'),
  city: z.string().describe('The city where the incident occurred (for context only, do not include in headline).'),
});
export type GenerateReportHeadlineInput = z.infer<typeof GenerateReportHeadlineInputSchema>;

const GenerateReportHeadlineOutputSchema = z.object({
  headline: z.string().describe('A concise and engaging headline for the report (max 10 words, focusing on the issue, not location).'),
});
export type GenerateReportHeadlineOutput = z.infer<typeof GenerateReportHeadlineOutputSchema>;

export async function generateReportHeadline(input: GenerateReportHeadlineInput): Promise<GenerateReportHeadlineOutput> {
  return generateReportHeadlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportHeadlinePrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: GenerateReportHeadlineInputSchema},
  output: {schema: GenerateReportHeadlineOutputSchema},
  prompt: `Generate a concise and engaging headline (maximum 10 words, ideally 5-7 words) for a labor report. The headline should focus on the nature of the issue and be suitable for a public dashboard. **Do not include specific street addresses, city names, or any geographical location details in the headline itself.**

Report Details for Context (do not include location in the headline):
Description: {{{description}}}
Type of Issue: {{{typeOfIncidence}}}
Specific Location (for context only, do not use in headline): {{{location}}}
City (for context only, do not use in headline): {{{city}}}

Examples of good headlines (focus on the issue, not the location):
- "Allegations of Wage Theft Reported"
- "Safety Concerns Raised by Workers"
- "Reports of Unfair Pay Practices"
- "Workers Allege Unsafe Conditions"

Headline:`,
});

const generateReportHeadlineFlow = ai.defineFlow(
  {
    name: 'generateReportHeadlineFlow',
    inputSchema: GenerateReportHeadlineInputSchema,
    outputSchema: GenerateReportHeadlineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output || !output.headline) {
        // Fallback in case the AI doesn't generate a headline or an error occurs
        return { headline: `Issue Reported: ${input.typeOfIncidence}` };
    }
    return output;
  }
);

