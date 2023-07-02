import { z } from "zod";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubbreadditSubscriptionValidator } from "@/lib/validators/subreddit";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    
    if(!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    
    const body = await req.json();
    
    const { subredditId } = SubbreadditSubscriptionValidator.parse(body);
    
    const subscriptionExists = await db.subscription.findFirst({
      where: { subredditId, userId: session.user.id }
    });
    
    if (!subscriptionExists) {
      return new Response("You are are not subscribed to this subreddit.", { status: 400 });
    }

    const ownSubreddit = await db.subreddit.findFirst({
      where: {
        id: subredditId,
        creatorId: session.user.id,
      }
    });

    if (ownSubreddit) {
      return new Response("You cannot unsubscribe from your own subreddit", { status: 400 });
    }
    
    await db.subscription.delete({
      where: {
        userId_subredditId: {
          subredditId,
          userId: session.user.id
        }
      }
    });

    return new Response(subredditId);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not subscribe to the subreddit", { status: 500 });
  }
} 
