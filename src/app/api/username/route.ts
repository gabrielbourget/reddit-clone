import { z } from "zod";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UsernameValidator } from "@/lib/validators/username";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if(!session?.user) return new Response("Unathourhized", { status: 401 });

    const body = await req.json();

    const { name } = UsernameValidator.parse(body);

    const username = await db.user.findFirst({
      where: { username: name }
    });

    if (username) {
      return new Response("username is already taken", { status: 409 });
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { username: name }
    });

    return new Response("OK");

  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not subscribe to the subreddit", { status: 500 });
  }
}