import { z } from 'zod';

const schema = z.object({
  ENABLE_API_MOCKING: z
    .enum(['true', 'false'])
    .default('true')
    .transform((v) => v === 'true'),
});

export const env = schema.parse({
  ENABLE_API_MOCKING: import.meta.env.VITE_APP_ENABLE_API_MOCKING,
});
