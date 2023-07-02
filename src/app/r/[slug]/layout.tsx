import { notFound } from "next/navigation";
import { format } from "date-fns";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

type LayoutProps = {
  children: React.ReactNode;
  params: { slug: string };
};

const Layout = async (props: LayoutProps) => {
  const { children, params: { slug }} = props;

  const session = await getAuthSession();

  const subbreadit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
        
        take: INFINITE_SCROLLING_PAGINATION_RESULTS
      }
    }
  });

  const subscription = !session?.user ? undefined : await db.subscription.findFirst({
    where: {
      subreddit: { name: slug },
      user: { id: session.user.id}
    },
  });

  const isSubscribed = !!subscription;

  if (!subbreadit) return notFound();

  const memberCount = await db.subscription.count({
    where: { subreddit: { name: slug }}
  });

  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="flex flex-col col-span-2 space-y-6">
            {children}
          </div>

          <div className="hidden md:block overflow-hidden h-fit rounded-lg border-gray-200 order-first md:order-last">
            <div className="px-6 py-4">
              <p className="font-semibold py-3">About r/{subbreadit.name}</p>
            </div>

            <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-700">
                  <time dateTime={subbreadit.createdAt.toDateString()}>
                    { format(subbreadit.createdAt, "MMMM d, yyyy")}
                  </time>
                </dd>
              </div>

              <div className="flex justify-between gap-x-4">
                <dt className="text-gray-500">Members</dt>
                <dd className="text-gray-700">
                  <div className="text-gray-900">{memberCount}</div>
                </dd>
              </div>

              {
                (subbreadit.creatorId === session?.user.id) ? (
                  <div className="flex justify-between gap-x-4 py-3">
                    <p className="text-gray-500">You created this community </p>
                  </div>
                ) : null
              }
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout;
