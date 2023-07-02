import { notFound } from "next/navigation";
import { db } from "@/lib/db"

type PageProps = {
  params: { slug: string }
}

const page = async ({ params }: PageProps) => {
  const subreddit = await db.subreddit.findFirst({
    where: { name: params.slug }
  });

  if(!subreddit) return notFound();

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
        <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">Create Post</h3>
        <p className="ml-2 mt-1 truncate text-sm text-gray-500">in r/{`${params.slug}`}</p>
      </div>
    </div>
  )
}

export default page;
