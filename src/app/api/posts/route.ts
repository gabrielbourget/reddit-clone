// -> Beyond codebase
import { z } from "zod";
// -> Within codebase
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await getAuthSession();

  let followedSubredditIds: string[] = [];

  if (session) {
    const followedSubreddits = await db.subscription.findMany({
      where: { userId: session.user.id },
      include: { subreddit: true }
    });

    followedSubredditIds = followedSubreddits.map(({ subreddit }) => subreddit.id);
  }

  try {
    const { limit, page, subredditName } = z.object({
      limit: z.string(),
      page: z.string(),
      subredditName: z.string().nullish().optional(),
    }).parse({
      subredditName: url.searchParams.get("subredditName"),
      limit: url.searchParams.get("limit"),
      page: url.searchParams.get("page"),
    });

    let whereClause = {};

    if (subredditName) {
      whereClause = { subreddit: { name: subredditName }};
    } else if (session) {
      whereClause = { subreddit: { id: { in: followedSubredditIds }}}
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: { createdAt: "desc" },
      include: {
        subreddit: true,
        votes: true,
        author: true,
        comments: true
      },
      where: whereClause
    });

    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not retrieve more posts", { status: 500 });
  }
};
