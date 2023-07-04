// -> Beyond codebase
import { redirect } from "next/navigation";
// -> Within codebase
import { authOptions, getAuthSession } from "@/lib/auth"
import UserNameForm from "@/components/UserNameForm";


const page = async ({}) => {
  const session = await getAuthSession();

  if (!session?.user) { redirect(authOptions.pages?.signIn || "/sign-in" )}

  
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="grid items-start gap-8">
        <h1 className="font-bold text-3xl md:text-4xl">Settings</h1>
      </div>

      <div className="grid gap-10">
        <UserNameForm />
      </div>
    </div>
  )
}

export default page