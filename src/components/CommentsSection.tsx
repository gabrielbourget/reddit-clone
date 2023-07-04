// -> Beyond codebase
// -> Within codebase

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";

const CommentsSection = async ({ postId }: { postId: string }) => {
  const session = await getAuthSession();
  const comments = await db.comment.findMany({
    where: { postId, replyToId: null },
    include: {
      author: true,
      votes: true,
      replies: {
        include: { author: true, votes: true }
      }
    }
  });

  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <br className="w-full h-px my-6" />

      <CreateComment />

      <div className="flex flex-col gap-y-6">
        {
          comments.filter((comment) => !comment.replyToId).map((topLevelComment) => {
            const topLevelCommentVotesAmt = topLevelComment.votes.reduce((acc, vote) => {
              if (vote.type === "UP") return acc + 1;
              if (vote.type === "DOWN") return acc - 1;
              return acc;
            }, 0);

            const topLevelCommentVote = topLevelComment.votes.find((vote) => vote.userId === session?.user.id )

            return (
              <div className="flex flex-col" key={topLevelComment.id}>
                <div className="mb-2">
                  <PostComment comment={topLevelComment} />
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  )
}

export default CommentsSection