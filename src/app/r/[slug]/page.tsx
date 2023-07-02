import { notFound } from "next/navigation";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import MiniCreatePost from "@/components/MiniCreatePost";


type PageProps = {
  params: {
    slug: string;
  }
}


const page = async (props: PageProps) => {
  const { params: { slug }} = props;

  const session = await getAuthSession();

  const subbreadit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true
        },
        
        take: INFINITE_SCROLLING_PAGINATION_RESULTS
      }
    }
  });

  if (!subbreadit) return notFound();

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        r/{subbreadit.name}
      </h1>
      <MiniCreatePost session={session} />
      
    </>
  )
}

export default page