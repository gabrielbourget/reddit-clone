import { z } from "zod";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    
    if(!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    
    const body = await req.json();
    
    const { title, content, subredditId } = PostValidator.parse(body);
    
    const subscriptionExists = await db.subscription.findFirst({
      where: { subredditId, userId: session.user.id }
    });
    
    if (!subscriptionExists) {
      return new Response("Subscribe to subreddit in order to post", { status: 400 });
    }
    
    await db.post.create({
      data: { title, content, subredditId, authorId: session?.user.id }
    });

    return new Response(subredditId);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not create the new post on the subreddit", { status: 500 });
  }
} 
