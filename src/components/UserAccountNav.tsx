
import { User } from "next-auth"
import { DropdownMenu, DropdownMenuTrigger } from "./ui/DropdownMenu";
import UserAvatar from "./UserAvatar";

type UserAccountNavProps = {
  user: Pick<User, "name" | "image" | "email">;
}

const UserAccountNav = (props: UserAccountNavProps) => {
  const { user } = props;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
    </DropdownMenu>
  )
}

export default UserAccountNav
