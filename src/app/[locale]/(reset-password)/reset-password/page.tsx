import { ResetPasswordPage } from "@/components/sections/ResetPasswordPage/ResetPasswordPage"

export default async function ResetPasswordPageWrapper({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>
}) {
  const { token } = await searchParams

  return <ResetPasswordPage token={token} />
}
