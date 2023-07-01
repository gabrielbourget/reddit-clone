import Link from "next/link";
import { toast } from "./use-toast";
import { buttonVariants } from "@/components/ui/Button";

export const useCustomToast = () => {
  const unauthenticatedToast = () => {
    const { dismiss } = toast({
      title: "Login required.",
      description: "You must be logged in to perform this action.",
      variant: "destructive",
      action: (
        <Link
          href="/sign-in"
          className={buttonVariants({ variant: "outline" })}
          onClick={() => dismiss()}
        >
          Login
        </Link>
      )
    })
  }

  return {unauthenticatedToast};
}