import { z } from "zod";

export const transactionDisputeSchema = z.object({
  notifyTarget: z.enum([
    "operations_team",
    "finance_team",
    "provider_support",
  ]),

  reason: z
    .string()
    .min(10, "Please describe the issue in at least 10 characters."),
});

export type TransactionDisputeSchema = z.infer<
  typeof transactionDisputeSchema
>;
