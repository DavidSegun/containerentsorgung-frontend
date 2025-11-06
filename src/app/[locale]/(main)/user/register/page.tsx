import { RegisterPage } from "@/components/sections/RegisterPage/RegisterPage"
import { retrieveCustomer } from "@/lib/data/customer"
import { redirect } from "next/navigation"

export default async function Page() {
  const user = await retrieveCustomer()

  if (user) {
    redirect("/user")
  }

  return <RegisterPage />
}
