"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "./ui/Button";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";

type SubscribeLeaveToggleProps = {
  subredditId: string;
}

const SubscribeLeaveToggle = (props: SubscribeLeaveToggleProps) => {
  const { subredditId } = props;

  const isSubscribed = false;

  const { } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = { subredditId } 

      const { data } = await axios.post("/api/subreddit/subscribe")
    }
  })

  return isSubscribed ? (
    <Button className="w-full mt-1 mb-4">Leave Community</Button>
  ) : (
    <Button className="w-full mt-1 mb-4">Subscribe</Button>
  )
}

export default SubscribeLeaveToggle