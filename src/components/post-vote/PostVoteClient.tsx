"use client";

// -> Beyond codebase
import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
// -> Withi ncodebase
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PostVoteRequest } from "@/lib/validators/vote";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";


type PostVoteClientProps = {
  postId: string;
  initialVotesAmt: number;
  initialVote?: VoteType | null;
}

const PostVoteClient = (props: PostVoteClientProps) => {
  const { postId, initialVotesAmt, initialVote } = props;

  const { unauthenticatedToast } = useCustomToast();
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  useEffect(() => {
    setCurrentVote(initialVote); 
  }, [initialVote]);

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = { postId, voteType };

      await axios.patch("/api/subreddit/post/vote", payload);
    },
    onError: (err, voteType) => {
      if (voteType === "UP") setVotesAmt((prev) => prev -1);
      else setVotesAmt((prev) => prev + 1);

      setCurrentVote(prevVote);

      if (err instanceof AxiosError) return unauthenticatedToast();

      return toast({
        title: "Something went wrong",
        description: "Your vote was not successfully recorded, please try again.",
        variant: "destructive"
      });
    },
    onMutate: (voteType: VoteType) => {
      if (currentVote === voteType) {
        setCurrentVote(undefined);
        if (voteType === "UP") setVotesAmt((prev) => prev - 1);
        else if (voteType === "DOWN") setVotesAmt((prev) => prev + 1);
      } else {
        setCurrentVote(voteType);
        if (voteType === "UP") setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
        if (voteType === "DOWN") setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
      }
    }
  });

  return (
    <div className="flex flex-col gap-2 sm:gap-0 sm:w-20 pb-4 sm:pb-0">
      <Button
        size="sm"
        variant="ghost"
        aria-label="Upvote"
        onClick={() => vote("UP")}
      >
        <ArrowBigUp
          className={cn(
            "h-5 w-5 text-zinc-700",
            { "text-emerald-500 fill-emerald-500": currentVote === "UP" }
          )}
        />
      </Button>
      
      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {votesAmt}
      </p>

      <Button
        size="sm"
        variant="ghost"
        aria-label="Downvote"
        onClick={() => vote("DOWN")}
      >
        <ArrowBigDown
          className={cn(
            "h-5 w-5 text-zinc-700",
            { "text-red-500 fill-red-500": currentVote === "DOWN" }
          )}
        />
      </Button>
    </div>
  )
}

export default PostVoteClient