"use client";

import { User } from "next-auth"
import { signOut } from "next-auth/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/DropdownMenu";
import UserAvatar from "./UserAvatar";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

type UserAccountNavProps = {
  user: Pick<User, "name" | "image" | "email">;
}

const UserAccountNav = (props: UserAccountNavProps) => {
  const { user } = props;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          className="h-8 w-8"
          user={{
            name: user.name || null,
            image: user.image || null,
          }}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {
              (user.name) ? (
                <>
                  <p className="font-medium">{user.name}</p>
                </>
              ) : undefined
            }
            {
              (user.email) ? (
                <>
                  <p className="w-[200px] truncate text-sm text-zinc-700">{user.email}</p>
                </>
              ) : undefined
            }
          </div>
        </div>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/">Feed</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/r/create">Create SubBreadit</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild> 
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/sign-in`
            })
          }}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav
