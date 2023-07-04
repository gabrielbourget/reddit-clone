"use client";

// -> Beyond codebase
import { useState } from "react";
// -> Within codebase
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { TextArea } from "./ui/TextArea";
import { useMutation } from "@tanstack/react-query";


const CreateComment = () => {
  const [input, setInput] = useState<string>("");

  const {} = useMutation({
    mutationFn: async () => {
      
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
          <Button>Post Comment</Button>
        </div>
      </div>
    </div>
  )
}

export default CreateComment;
