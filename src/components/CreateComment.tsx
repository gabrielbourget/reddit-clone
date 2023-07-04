"use client";

// -> Beyond codebase
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
// -> Within codebase
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { CommentRequest } from "@/lib/validators/comment";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { TextArea } from "./ui/TextArea";

type CreateCommentProps = {
  postId: string;
  replyToId?: string;
}


const CreateComment = (props: CreateCommentProps) => {
  const [input, setInput] = useState<string>("");
  const { unauthenticatedToast } = useCustomToast();
  const router = useRouter();
  
  const { postId, replyToId } = props;
  
  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest ) => {
      const payload: CommentRequest = { postId, text, replyToId };

      const { data } = await axios.patch(`/api/subreddit/post/comment`, payload);
      return data;
    },
    onError: (err) =>{
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return unauthenticatedToast();
        }
        
        return toast({
          title: "Something went wrong.",
          description: "There was a problem creating your comment, please try again.",
          variant: "destructive"
        });
      }
    },
    onSuccess: () => {
      router.refresh();
      setInput("");
    }
  })

  return (
    <div className="grid w-full gap-1.5">
      <Label>Comment below</Label>
      <div className="mt-2">
        <TextArea
          id="comment"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder="What's on your mind?"
        />

        <div className="mt-2 flex justify-end">
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => postComment({ postId, text: input, replyToId })}
          >
            Post Comment
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateComment;
