"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils"
import { Button } from "./ui/Button"
import { Icons } from "./Icons";
import { useToast } from "@/hooks/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm = (props: UserAuthFormProps) => {
  const { className, ...rest } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signIn("google");
      throw new Error()
    } catch (err) {
        toast({
          title: "There was a problem",
          description: "There was an error logging in with Google",
          variant: "destructive",
        })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div {...rest} className={cn("flex justify-center", className)}>
      <Button
        onClick={loginWithGoogle}
        size="sm"
        className="w-full"
      >
        {
          (isLoading) ? null : (
            <>
              <Icons.google className="h-4 w-4 mr-2" />
              Google
            </>
          ) 
        }
      </Button>
    </div>
  )
};

export default UserAuthForm
