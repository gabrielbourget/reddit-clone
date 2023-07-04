import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")

  if (!q) return new Response("Invalid query", { status: 400 });

  const searchResults = await db.subreddit.findMany({
    where: { name: { startsWith: q }},
    include: { _count: true },
    take: 5,
  });

  // console.log(`search results -> ${searchResults}`);

  return new Response(JSON.stringify(searchResults));
}
