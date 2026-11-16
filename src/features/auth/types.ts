import type { z } from "zod";
import type { createLoginSchema, createSignupSchema } from "./schemas";

/**
 * Form value types, inferred from the schemas so the rules and the fields can
 * never drift apart.
 */
export type LoginValues = z.infer<ReturnType<typeof createLoginSchema>>;
export type SignupValues = z.infer<ReturnType<typeof createSignupSchema>>;
