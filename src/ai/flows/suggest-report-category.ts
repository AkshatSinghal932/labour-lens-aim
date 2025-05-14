
'use server';
/**
 * @fileOverview AI flow to suggest a category for a user's report based on the text content.
 *
 * - suggestReportCategory - A function that suggests a category for the report.
 * - SuggestReportCategoryInput - The input type for the suggestReportCategory function.
 * - SuggestReportCategoryOutput - The output type for the suggestReportCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestReportCategoryInputSchema = z.object({
  reportText: z.string().describe('The text content of the report.'),
});
export type SuggestReportCategoryInput = z.infer<typeof SuggestReportCategoryInputSchema>;

const SuggestReportCategoryOutputSchema = z.object({
  category: z.string().describe('The suggested category for the report.'),
  confidence: z.number().describe('The confidence level of the suggestion (0-1).'),
});
export type SuggestReportCategoryOutput = z.infer<typeof SuggestReportCategoryOutputSchema>;

export async function suggestReportCategory(input: SuggestReportCategoryInput): Promise<SuggestReportCategoryOutput> {
  return suggestReportCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestReportCategoryPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: SuggestReportCategoryInputSchema},
  output: {schema: SuggestReportCategoryOutputSchema},
  prompt: `Based on the following report text, suggest a category for the report. Also, provide a confidence level (0-1) for your suggestion.\n\nReport Text: {{{reportText}}}`,
});

const suggestReportCategoryFlow = ai.defineFlow(
  {
    name: 'suggestReportCategoryFlow',
    inputSchema: SuggestReportCategoryInputSchema,
    outputSchema: SuggestReportCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

