// -> Beyond codebase
import { db } from '@/lib/db';
import { Post, User, Vote } from '@prisma/client';
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
// -> Within codebase
import CommentsSection from '@/components/CommentsSection';
import EditorOutput from '@/components/EditorOutput';
import PostVoteServer from '@/components/post-vote/PostVoteServer';
import { buttonVariants } from '@/components/ui/Button';
import { redis } from '@/lib/redis';
import { formatTimeToNow } from '@/lib/utils';
import { CachedPost } from '@/types/redis';

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface PageProps {
  params: {
    postId: string;
  }
}

const Page = async (props: PageProps) => {
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

        <div className="sm:w-0 w-full flex-1 bg-white p-4 rounded-sm">
          <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
            Posted by u/{post?.author.username ?? cachedPost.authorUsername }
            <span className='px-1'>•</span>
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt ))}
          </p>

          <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
            { post?.title ?? cachedPost.title }
          </h1>

          <EditorOutput content={post?.content ?? cachedPost.content} />

          <Suspense fallback={<Loader2 className="w-5 h-5 text-zinc-500 animate-spin"/>}>
            {/* @ts-expect-error server component */}
            <CommentsSection postId={postId ?? cachedPost.id } />
          </Suspense>
        </div>
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

export default Page