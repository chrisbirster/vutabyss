import { z } from "zod";

export const createDeckRequest = z.object({
  name: z.string().min(1, "Deck name is required."),
  description: z.string().optional(),
});
