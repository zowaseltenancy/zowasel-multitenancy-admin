import { z } from "zod";

export const kybRejectionSchema = z.object({
  reason: z
    .string()
    .min(10, "Please provide a reason of at least 10 characters."),
});

export type KybRejectionSchema = z.infer<typeof kybRejectionSchema>;
