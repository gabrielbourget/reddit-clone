import { z } from "zod";

export const PostValidator = z.object({
  title: z.string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(240, { message: "Title must be no longer than 240 characters"}),
  subredditId: z.string(),
  content: z.any()
});

export type PostCreationRequest = z.infer<typeof PostValidator>