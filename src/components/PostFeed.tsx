"use client";

// -> Beyond Codebase
import { useIntersection } from "@mantine/hooks";
import { Vote } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRef } from "react";
// -> Within Codebase
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import type { ExtendedPost } from "@/types/db";
import Post from "./Post";

type PostFeedProps = {
  initialPosts: ExtendedPost[];
  subredditName?: string;
}

const PostFeed = (props: PostFeedProps) => {
  const { initialPosts, subredditName } = props;
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref: intersectionRef, entry } = useIntersection({ root: lastPostRef.current, threshold: 1 });

  const { data: session } = useSession();

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["post-feed-query"],
    async ({ pageParam = 1}) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` + 
        (!!subredditName) ? `&subredditName=${subredditName}` : "";
      
        const { data } = await axios.get(query);

        return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => pages.length + 1,
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  );

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {
        posts.map((post: ExtendedPost, index: number) => {
          const votesAmt = post.votes.reduce((acc: number, vote: Vote) => {
            if (vote.type === "UP") return acc + 1;
            else if (vote.type === "DOWN") return acc - 1;
            return acc;
          }, 0);

          const currentVote = post.votes.find((vote) => vote.userId === session?.user.id);
          const commentAmt = post.comments.length;

          if (index === posts.length - 1) {
            return (
              <li key={post.id} ref={intersectionRef}>
                <Post
                  subredditName={post.subreddit.name}
                  post={post}
                  commentAmt={commentAmt}
                  votesAmt={votesAmt}
                  currentVote={currentVote}
                  />
              </li>
            );
          } else {
            return (
              <Post
                subredditName={post.subreddit.name}
                post={post}
                commentAmt={commentAmt}
                votesAmt={votesAmt}
                currentVote={currentVote}
                key={post.id}
              />
            );
          }
        })
      }
    </ul>
  )
}

export default PostFeed