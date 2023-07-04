import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentValidator } from "@/lib/validators/comment";
import { z } from "zod";

export async function PATCH(req: Request) {
  // const url = new URL(req.url);

  try {
    const body = await req.json();

    const { text, postId, replyToId, } = CommentValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    await db.comment.create({
      data: {
        text, postId, replyToId,
        authorId: session.user.id
      },
    });

    return new Response("Comment was created successfully", { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not create the comment for this post", { status: 500 });
  }
}