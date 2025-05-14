
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  // The 'model' option is not a standard top-level option for the genkit() constructor.
  // Models should be specified in ai.definePrompt, ai.generate, or within the plugin's configuration if supported.
});

