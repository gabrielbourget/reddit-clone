import { z } from "zod";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubbreadditSubscriptionValidator } from "@/lib/validators/subreddit";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    console.log(` -> ${JSON.stringify(session ,null, 4)}`);
    
    if(!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    
    const body = await req.json();
    
    const { subredditId } = SubbreadditSubscriptionValidator.parse(body);
    console.log(`subreddit ID -> ${subredditId}`);
    
    const subscriptionExists = await db.subscription.findFirst({
      where: { subredditId, userId: session.user.id }
    });
    
    if (subscriptionExists) {
      return new Response("You are already subscribed to this subreddit.", { status: 400 });
    }
    
    console.log(`before subscribing`);
    
    await db.subscription.create({
      data: {
        subredditId,
        userId: session.user.id
      }
    });

    console.log(`after subscribing`);

    return new Response(subredditId);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not subscribe to the subreddit", { status: 500 });
  }
} 
