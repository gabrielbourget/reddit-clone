import { z } from "zod";

export const SubredditValidator = z.object({
  name: z.string().min(3).max(40),
});

export const SubbreadditSubscriptionValidator = z.object({
  subredditId: z.string()
});

export type CreateSubredditPayload = z.infer<typeof SubredditValidator>;
export type SubscribeToSubredditPayload = z.infer<typeof SubbreadditSubscriptionValidator>;
