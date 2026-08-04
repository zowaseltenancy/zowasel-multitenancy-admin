import { z } from "zod";

export const transactionDisputeSchema = z.object({
  reason: z
    .string()
    .min(10, "Please describe the issue in at least 10 characters."),
});

export type TransactionDisputeSchema = z.infer<
  typeof transactionDisputeSchema
>;
