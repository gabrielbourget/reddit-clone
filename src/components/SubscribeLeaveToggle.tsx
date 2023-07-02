"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Button } from "./ui/Button";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";

type SubscribeLeaveToggleProps = {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
}

const SubscribeLeaveToggle = (props: SubscribeLeaveToggleProps) => {
  const { subredditId, subredditName, isSubscribed } = props;
  const router = useRouter();
  const { unauthenticatedToast } = useCustomToast();

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = { subredditId } 

      const { data } = await axios.post("/api/subreddit/subscribe", { subredditId });
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return unauthenticatedToast();
        }
      }

      return toast({
        title: "There was a problem.",
        description: "Something went wrong trying to subscribe to this subreddit, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => router.refresh())

      return toast({
        title: "Success",
        description: `You are now subscribed to r/${subredditName}`,
        variant: "default",
      });
    }
  });

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = { subredditId } 

      const { data } = await axios.post("/api/subreddit/unsubscribe", { subredditId });
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return unauthenticatedToast();
        }
      }

      return toast({
        title: "There was a problem.",
        description: "Something went wrong trying to unsubscribe to this subreddit, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => router.refresh())

      return toast({
        title: "Success",
        description: `You are now unsubscribed from r/${subredditName}`,
        variant: "default",
      });
    }
  });

  return isSubscribed ? (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={isUnsubLoading}
      onClick={() => unsubscribe()}
    >
      Leave Community
    </Button>
  ) : (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={isSubLoading}
      onClick={() => subscribe()}
    >
      Subscribe
    </Button>
  )
}

export default SubscribeLeaveToggle;
