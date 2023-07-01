import { User } from "next-auth";
import { Avatar, AvatarFallback } from "./ui/Avatar";
import Image from "next/image";
import { Icons } from "./Icons";
import { AvatarProps } from "@radix-ui/react-avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image" | "email">;
}

const UserAvatar = (props: UserAvatarProps) => {
  const { user, ...rest } = props;

  return (
    <Avatar {...rest}>
      {
        (user.image) ? (
          <div className="relative aspect-square h-full w-full">
            <Image
              fill
              src={user.image}
              alt="Profile Photo"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <AvatarFallback>
            <span className="sr-only">{user?.name}</span>
            <Icons.user />
          </AvatarFallback>
        )
      }
    </Avatar>
  )
}

export default UserAvatar