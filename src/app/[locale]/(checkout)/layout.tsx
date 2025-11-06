import { ContainerHeader } from "@/components/organisms/ContainerHeader/ContainerHeader"
import { Footer } from "@/components/organisms/Footer/Footer"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <ContainerHeader />
      {children}
      <Footer />
    </>
  )
}
