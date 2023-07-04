// -> Beyond codebase
import { db } from '@/lib/db';
import { Post, User, Vote } from '@prisma/client';
import { notFound } from 'next/navigation';
// -> Within codebase
import { buttonVariants } from '@/components/ui/Button';
import { redis } from '@/lib/redis';
import { CachedPost } from '@/types/redis';
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import PostVoteServer from '@/components/post-vote/PostVoteServer';

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface PageProps {
  params: {
    postId: string;
  }
}

const page = async (props: PageProps) => {
  const { params: { postId }} = props;

  const cachedPost = await redis.hgetall(`post:${postId}`) as CachedPost;

  let post: (Post & { votes: Vote[]; author: User }) | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: { id: postId },
      include: { votes: true, author: true }
    });
  }

  if (!post && !cachedPost) return notFound();

  return (
    <div>
      <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
        <Suspense fallback={<PostVoteShell />}>
          {/* @ts-expect-error server component */}
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: { id: postId },
                include: { votes: true }
              }); 
            }}
          />
        </Suspense>

        
      </div>
    </div>
  )
}

function PostVoteShell() {
  return (
    <div className="flex items-center flex-col pr-6 w-20">
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigUp className="h-5 w-5 text-zinc-700" />
      </div>
      <div className="text-center py-2 font-medium text-sm text-zinc-900">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigDown className="h-5 w-5 text-zinc-700" />
      </div>
    </div>
  )
}

export default page