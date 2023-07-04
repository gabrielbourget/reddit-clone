"use client";
// -> Beyond codebase
import { Comment, CommentVote, User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
// -> Within codebase
import { toast } from "@/hooks/use-toast";
import { formatTimeToNow } from "@/lib/utils";
import { CommentRequest } from "@/lib/validators/comment";
import UserAvatar from "./UserAvatar";
import CommentVotes from "./post-vote/CommentVotes";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { TextArea } from "./ui/TextArea";

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
  const router = useRouter();
  const { data: session } = useSession();

  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = { postId, text, replyToId };

      const { data } = await axios.patch("/api/subreddit/post/comment", payload);
      return data;
    },
    onError: () => {
      return toast({
        title: "Something went wrong",
        description: "Something went wrong trying to post this comment, please try again.",
        variant: "destructive"
      });
    },
    onSuccess: () => {
      router.refresh();
      setInput("");
      setIsReplying(false);
    }
  })

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

      <div className="flex gap-2 items-center flex-wrap">
        <CommentVotes commentId={comment.id} initialVotesAmt={votesAmt}/>

        <Button
          variant="ghost"
          size="xs"
          onClick={() => {
            if (!session) return router.push("/sign-in")
            setIsReplying(true);
          }}
        >
          <MessageSquare className="h-4 w-4 mr-1.5" />
          {" "}Reply
        </Button>

        {
          (isReplying) ? (
            <div className="grid w-full gap-1.5">
              <Label>Your reply</Label>
              <div className="mt-2">
                <TextArea
                  id="comment"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={1}
                  placeholder="What's on your mind?"
                />

                <div className="mt-2 flex justify-end gap-2">
                  <Button
                    tabIndex={-1}
                    variant="subtle"
                    size="xs"
                    onClick={() => {
                      setIsReplying(false);
                      setInput("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    isLoading={isLoading}
                    size="xs"
                    disabled={input.length === 0}
                    onClick={() => {
                      if (!input) return;
                      postComment({ postId, text: input, replyToId: comment.replyToId ?? comment.id })
                    }}
                  >
                    Post Reply
                  </Button>
                </div>
              </div>
            </div>
          ) : null
        }
      </div>
    </div>
  )
}

export default PostComment