"use client";
// -> Beyond codebase
import { Comment, CommentVote, User } from "@prisma/client";
import { useRef } from "react";
// -> Within codebase
import { formatTimeToNow } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
import CommentVotes from "./post-vote/CommentVotes";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
}

type PostCommentProps = {
  comment: ExtendedComment;
  votesAmt: number;
  currentVote: CommentVote | undefined;
  postId: string;
}

const PostComment = (props: PostCommentProps) => {
  const { comment, votesAmt, currentVote, postId } = props;
  const commentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="" ref={commentRef}>
      <div className="flex items-center">
        <UserAvatar
          user={{ name: comment.author.name || null }}
          className="h-6 w-6"
        />

        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">
            u/{comment.author.username}
          </p>
          <p className="max-h-50 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>

      <div className="flex gap-2 items-center">
        <CommentVotes commentId={comment.id} initialVotesAmt={votesAmt}/>
      </div>
    </div>
  )
}

export default PostComment